import { NextRequest } from "next/server";
import { auth } from "~/server/auth";
import { google } from "googleapis";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { analyzeBatchSentiments } from '../../../../server/sentiment-analysis';

const oauth2Client = new google.auth.OAuth2(
	process.env.AUTH_GOOGLE_ID,
	process.env.AUTH_GOOGLE_SECRET
);

const youtube = google.youtube({
	version: "v3",
	auth: oauth2Client,
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ streamId: string }> }
) {
	const session = await auth();
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const streamId = (await params).streamId;
	if (!streamId) {
		return new Response("Stream ID is required", { status: 400 });
	}

	// Get user's Google account
	const account = await db.query.accounts.findFirst({
		where: (accounts, { eq, and }) =>
			and(
				eq(accounts.userId, session.user.id),
				eq(accounts.provider, "google"),
			),
	});

	if (!account?.access_token) {
		return new Response("No access token found", { status: 401 });
	}

	// Set up YouTube API client with user's access token
	oauth2Client.setCredentials({
		access_token: account.access_token,
	});

	// Get live chat ID
	const videoResponse = await youtube.videos.list({
		part: ["liveStreamingDetails"],
		id: [streamId],
	});

	const liveChatId = videoResponse.data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
	if (!liveChatId) {
		return new Response("Live chat not found for this stream", { status: 404 });
	}

	// Set up SSE response
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			let isConnectionActive = true;
			let timeoutId: NodeJS.Timeout | undefined;
			let nextPageToken: string | undefined;
			let pollingInterval = 5000;
			let retryCount = 0;
			const MAX_RETRIES = 3;
			const MAX_POLLING_INTERVAL = 10000;

			const cleanup = () => {
				isConnectionActive = false;
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = undefined;
				}
			};

			const safeEnqueue = (data: string) => {
				if (isConnectionActive) {
					try {
						controller.enqueue(encoder.encode(data));
					} catch (error) {
						console.error("Error enqueueing data:", error);
						cleanup();
						controller.close();
					}
				}
			};

			// Send initial connection message
			safeEnqueue("data: connected\n\n");

			// Function to fetch chat messages
			const fetchMessages = async () => {
				if (!isConnectionActive) {
					cleanup();
					return;
				}

				try {
					const chatResponse = await youtube.liveChatMessages.list({
						liveChatId,
						part: ["snippet", "authorDetails"],
						pageToken: nextPageToken,
						maxResults: 50,
					});

					if (!isConnectionActive) {
						cleanup();
						return;
					}

					nextPageToken = chatResponse.data.nextPageToken ?? undefined;
					pollingInterval = Math.min(
						chatResponse.data.pollingIntervalMillis || 5000,
						MAX_POLLING_INTERVAL
					);

					const messages = chatResponse.data.items?.map((item) => ({
						id: item.id!,
						author: item.authorDetails?.displayName ?? "Anonymous",
						message: item.snippet?.displayMessage ?? "",
						timestamp: item.snippet?.publishedAt ?? new Date().toISOString(),
					})) ?? [];

					// Analyze sentiments in batch
					const sentiments = await analyzeBatchSentiments(messages.map(m => m.message));
					console.log("sentiments", sentiments);

					// Add sentiments to messages with error handling
					const messagesWithSentiment = messages.map((msg, index) => {
						const sentimentResult = sentiments[index] || { sentiment: 'neutral', score: 0 };
						return {
							...msg,
							sentiment: sentimentResult.sentiment,
							sentimentScore: sentimentResult.score,
						};
					});

					if (messagesWithSentiment.length > 0) {
						const data = JSON.stringify({ 
							messages: messagesWithSentiment,
							timestamp: new Date().toISOString()
						});
						safeEnqueue(`data: ${data}\n\n`);
					}

					retryCount = 0;
				} catch (error) {
					if (!isConnectionActive) {
						cleanup();
						return;
					}

					console.error("Error fetching chat messages:", error);
					
					if (error instanceof Error && 
						(error.message.includes("quota") || 
						 error.message.includes("exceeded"))) {
						retryCount++;
						
						if (retryCount >= MAX_RETRIES) {
							console.error("Max retries reached, closing connection");
							cleanup();
							safeEnqueue("data: {\"error\": \"quota_exceeded\"}\n\n");
							controller.close();
							return;
						}

						pollingInterval = Math.min(pollingInterval * 2, MAX_POLLING_INTERVAL);
						console.log(`Quota exceeded, backing off to ${pollingInterval}ms`);
					} else if (error instanceof Error && error.message.includes("Invalid Credentials")) {
						try {
							oauth2Client.setCredentials({
								refresh_token: account.refresh_token
							});
							const { token } = await oauth2Client.getAccessToken();
							
							await db.update(accounts)
								.set({ access_token: token })
								.where(and(
									eq(accounts.userId, session.user.id),
									eq(accounts.provider, "google"),
								));

							oauth2Client.setCredentials({
								access_token: token,
							});
						} catch (refreshError) {
							console.error("Error refreshing token:", refreshError);
							cleanup();
							controller.close();
							return;
						}
					}
				}

				if (isConnectionActive) {
					timeoutId = setTimeout(fetchMessages, pollingInterval);
				} else {
					cleanup();
				}
			};

			// Start fetching messages
			fetchMessages();

			// Handle manual stop command
			request.signal.addEventListener("abort", () => {
				cleanup();
				try {
					controller.close();
				} catch (error) {
					console.error("Error closing controller:", error);
				}
			});

			// Handle visibility change
			if (typeof document !== 'undefined') {
				document.addEventListener('visibilitychange', () => {
					if (document.hidden) {
						cleanup();
						controller.close();
					}
				});
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
		},
	});
} 