import { google } from "googleapis";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

interface ChatMessage {
	id: string;
	author: string;
	message: string;
	timestamp: string;
	sentiment: "positive" | "neutral" | "negative";
}

interface ChatConnection {
	liveChatId: string;
	accessToken: string;
	nextPageToken?: string;
	lastPollTime: number;
	lastMessageId?: string;
	pollingInterval: number;
}

class ChatManager {
	private static instance: ChatManager;
	private activeChats: Map<string, ChatConnection> = new Map();
	private messageSubscribers: Map<string, Set<(messages: ChatMessage[]) => void>> = new Map();
	private pollInterval: NodeJS.Timeout | null = null;
	private readonly DEFAULT_POLLING_INTERVAL = 3000; // 3 seconds default
	private readonly MIN_POLLING_INTERVAL = 1000; // 1 second minimum
	private readonly MAX_POLLING_INTERVAL = 10000; // 10 seconds maximum

	private constructor() {
		this.startPolling();
	}

	public static getInstance(): ChatManager {
		if (!ChatManager.instance) {
			ChatManager.instance = new ChatManager();
		}
		return ChatManager.instance;
	}

	private startPolling() {
		if (this.pollInterval) return;

		this.pollInterval = setInterval(() => {
			this.pollAllChats();
		}, this.MIN_POLLING_INTERVAL);
	}

	private async pollAllChats() {
		const now = Date.now();
		const oauth2Client = new google.auth.OAuth2(
			process.env.AUTH_GOOGLE_ID,
			process.env.AUTH_GOOGLE_SECRET
		);
		const youtube = google.youtube({
			version: "v3",
			auth: oauth2Client,
		});

		for (const [streamId, connection] of this.activeChats) {
			try {
				// Skip if not enough time has passed since last poll
				if (now - connection.lastPollTime < connection.pollingInterval) continue;

				oauth2Client.setCredentials({
					access_token: connection.accessToken,
				});

				const chatResponse = await youtube.liveChatMessages.list({
					liveChatId: connection.liveChatId,
					part: ["snippet", "authorDetails"],
					pageToken: connection.nextPageToken,
				});

				// Update polling interval based on YouTube's recommendation
				if (chatResponse.data.pollingIntervalMillis) {
					connection.pollingInterval = Math.max(
						this.MIN_POLLING_INTERVAL,
						Math.min(
							this.MAX_POLLING_INTERVAL,
							chatResponse.data.pollingIntervalMillis
						)
					);
				}

				const messages = chatResponse.data.items?.map((item) => ({
					id: item.id!,
					author: item.authorDetails?.displayName ?? "Anonymous",
					message: item.snippet?.displayMessage ?? "",
					timestamp: item.snippet?.publishedAt ?? new Date().toISOString(),
					sentiment: "neutral" as const,
				})) ?? [];

				// Only send new messages
				const newMessages = messages.filter(
					(msg) => !connection.lastMessageId || msg.id > connection.lastMessageId
				);

				if (newMessages.length > 0) {
					// Update last message ID
					connection.lastMessageId = newMessages[0]?.id;
					
					// Update connection state
					connection.nextPageToken = chatResponse.data.nextPageToken ?? undefined;
					connection.lastPollTime = now;

					// Notify subscribers
					const subscribers = this.messageSubscribers.get(streamId);
					if (subscribers) {
						subscribers.forEach((callback) => callback(newMessages));
					}
				}
			} catch (error) {
				console.error(`Error polling chat for stream ${streamId}:`, error);
				// Increase polling interval on error to avoid rate limiting
				connection.pollingInterval = Math.min(
					connection.pollingInterval * 2,
					this.MAX_POLLING_INTERVAL
				);
			}
		}
	}

	public async initializeChat(streamId: string, userId: string): Promise<void> {
		try {
			const account = await db.query.accounts.findFirst({
				where: (accounts, { eq, and }) =>
					and(
						eq(accounts.userId, userId),
						eq(accounts.provider, "google"),
					),
			});

			if (!account?.access_token) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "No access token found",
				});
			}

			const oauth2Client = new google.auth.OAuth2(
				process.env.AUTH_GOOGLE_ID,
				process.env.AUTH_GOOGLE_SECRET
			);
			const youtube = google.youtube({
				version: "v3",
				auth: oauth2Client,
			});

			oauth2Client.setCredentials({
				access_token: account.access_token,
			});

			const videoResponse = await youtube.videos.list({
				part: ["liveStreamingDetails"],
				id: [streamId],
			});

			const liveChatId = videoResponse.data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Live chat not found for this stream",
				});
			}

			// Store chat connection with initial polling interval
			this.activeChats.set(streamId, {
				liveChatId,
				accessToken: account.access_token,
				lastPollTime: 0,
				pollingInterval: this.DEFAULT_POLLING_INTERVAL,
			});
		} catch (error) {
			console.error("Error initializing chat:", error);
			throw error;
		}
	}

	public subscribe(streamId: string, callback: (messages: ChatMessage[]) => void): () => void {
		if (!this.messageSubscribers.has(streamId)) {
			this.messageSubscribers.set(streamId, new Set());
		}
		this.messageSubscribers.get(streamId)!.add(callback);

		return () => {
			const subscribers = this.messageSubscribers.get(streamId);
			if (subscribers) {
				subscribers.delete(callback);
				if (subscribers.size === 0) {
					this.messageSubscribers.delete(streamId);
					this.activeChats.delete(streamId);
				}
			}
		};
	}

	public cleanup() {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
			this.pollInterval = null;
		}
		this.activeChats.clear();
		this.messageSubscribers.clear();
	}
}

export const chatManager = ChatManager.getInstance(); 