import { z } from "zod";
import { google, youtube_v3 } from "googleapis";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { accounts } from "~/server/db/schema";

const oauth2Client = new google.auth.OAuth2(
	process.env.AUTH_GOOGLE_ID,
	process.env.AUTH_GOOGLE_SECRET
);

const youtube = google.youtube({
	version: "v3",
	auth: oauth2Client,
});

async function refreshToken(account: { refresh_token: string | null }) {
	if (!account.refresh_token) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "No refresh token available",
		});
	}

	try {
		oauth2Client.setCredentials({
			refresh_token: account.refresh_token,
		});
		const { credentials } = await oauth2Client.refreshAccessToken();
		return {
			access_token: credentials.access_token,
			refresh_token: credentials.refresh_token || account.refresh_token,
		};
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'response' in error &&
			error.response &&
			typeof error.response === 'object' &&
			'data' in error.response &&
			error.response.data &&
			(error.response.data as { error: string }).error === 'invalid_grant'
		 ) {
			// Optionally: clear the refresh_token in DB here
			throw new TRPCError({
			  code: "UNAUTHORIZED",
			  message: "Your Google session has expired. Please sign in again.",
			});
		 }
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Failed to refresh token",
		});
	}
}

export const youtubeRouter = createTRPCRouter({
	getLiveStreams: protectedProcedure.query(async ({ ctx }): Promise<Array<{
		id: string;
		title: string;
		thumbnailUrl: string;
		viewerCount: number;
		duration: string;
	}>> => {
		const account = await ctx.db.query.accounts.findFirst({
			where: (accounts, { eq, and }) =>
				and(
					eq(accounts.userId, ctx.session.user.id),
					eq(accounts.provider, "google"),
				),
		});

		if (!account?.access_token) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "No access token found",
			});
		}

		// Set up YouTube API client with user's access token
		oauth2Client.setCredentials({
			access_token: account.access_token,
		});

		try {
			// First get the channel ID
			const channelResponse = await youtube.channels.list({
				part: ["id"],
				mine: true,
			});

			const channelId = channelResponse.data.items?.[0]?.id;
			if (!channelId) {
				return [];
			}

			// Search for user's live streams
			const searchResponse = await youtube.search.list({
				part: ["snippet"],
				channelId: channelId,
				type: ["video"],
				eventType: "live",
				maxResults: 50,
			});

			if (!searchResponse.data.items?.length) {
				return [];
			}

			// Get video details for each stream
			const videoIds = searchResponse.data.items.map((item) => item.id?.videoId!);
			const videos = await youtube.videos.list({
				part: ["snippet", "statistics", "contentDetails"],
				id: videoIds,
			});

			return videos.data.items?.map((video: youtube_v3.Schema$Video) => ({
				id: video.id!,
				title: video.snippet?.title!,
				thumbnailUrl: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url!,
				viewerCount: parseInt(video.statistics?.viewCount || "0"),
				duration: video.contentDetails?.duration || "0",
			})) || [];
		} catch (error) {
			// Check if the error is due to invalid credentials
			if (error instanceof Error && error.message.includes("Invalid Credentials")) {
				// Try to refresh the token
				const newTokens = await refreshToken(account);
				// Update the credentials with the new token
				oauth2Client.setCredentials({
					access_token: newTokens.access_token,
					refresh_token: newTokens.refresh_token,
				});
				// Update the tokens in the database
				await ctx.db.update(accounts)
					.set({ access_token: newTokens.access_token, refresh_token: newTokens.refresh_token })
					.where(and(
						eq(accounts.userId, ctx.session.user.id),
						eq(accounts.provider, "google"),
					));
				// Retry the operation with the new token
				const channelResponse = await youtube.channels.list({
					part: ["id"],
					mine: true,
				});
				const channelId = channelResponse.data.items?.[0]?.id;
				if (!channelId) {
					return [];
				}
				const searchResponse = await youtube.search.list({
					part: ["snippet"],
					channelId: channelId,
					type: ["video"],
					eventType: "live",
					maxResults: 50,
				});
				if (!searchResponse.data.items?.length) {
					return [];
				}
				const videoIds = searchResponse.data.items.map((item) => item.id?.videoId!);
				const videos = await youtube.videos.list({
					part: ["snippet", "statistics", "contentDetails"],
					id: videoIds,
				});
				return videos.data.items?.map((video: youtube_v3.Schema$Video) => ({
					id: video.id!,
					title: video.snippet?.title!,
					thumbnailUrl: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url!,
					viewerCount: parseInt(video.statistics?.viewCount || "0"),
					duration: video.contentDetails?.duration || "0",
				})) || [];
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch live streams",
				cause: error,
			});
		}
	}),

	getStreamInfo: protectedProcedure
		.input(z.object({ streamId: z.string() }))
		.query(async ({ ctx, input }) => {
			const account = await ctx.db.query.accounts.findFirst({
				where: (accounts, { eq, and }) =>
					and(
						eq(accounts.userId, ctx.session.user.id),
						eq(accounts.provider, "google"),
					),
			});

			if (!account?.access_token) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "No access token found",
				});
			}

			// Set up YouTube API client with user's access token
			oauth2Client.setCredentials({
				access_token: account.access_token,
			});

			const response = await youtube.videos.list({
				part: ["snippet", "statistics"],
				id: [input.streamId],
			});

			const video = response.data.items?.[0];
			if (!video) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Stream not found",
				});
			}

			return {
				title: video.snippet?.title ?? "",
				viewerCount: parseInt(video.statistics?.viewCount ?? "0"),
				thumbnailUrl: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url || "",
				duration: video.contentDetails?.duration || "0",
			};
		}),

	connectToChat: protectedProcedure
		.input(z.object({ streamId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const account = await ctx.db.query.accounts.findFirst({
				where: (accounts, { eq, and }) =>
					and(
						eq(accounts.userId, ctx.session.user.id),
						eq(accounts.provider, "google"),
					),
			});

			if (!account?.access_token) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "No access token found",
				});
			}

			// Set up YouTube API client with user's access token
			oauth2Client.setCredentials({
				access_token: account.access_token,
			});

			// Get live chat ID for the stream
			const videoResponse = await youtube.videos.list({
				part: ["liveStreamingDetails"],
				id: [input.streamId],
			});

			const liveChatId = videoResponse.data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Live chat not found for this stream",
				});
			}

			return { success: true, liveChatId };
		}),

	getLiveChatMessages: protectedProcedure
		.input(z.object({ 
			streamId: z.string(),
			pageToken: z.string().optional(),
		}))
		.query(async ({ ctx, input }) => {
			const account = await ctx.db.query.accounts.findFirst({
				where: (accounts, { eq, and }) =>
					and(
						eq(accounts.userId, ctx.session.user.id),
						eq(accounts.provider, "google"),
					),
			});

			if (!account?.access_token) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "No access token found",
				});
			}

			oauth2Client.setCredentials({
				access_token: account.access_token,
			});

			// Get live chat ID
			const videoResponse = await youtube.videos.list({
				part: ["liveStreamingDetails"],
				id: [input.streamId],
			});

			const liveChatId = videoResponse.data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Live chat not found for this stream",
				});
			}

			// Get chat messages
			const chatResponse = await youtube.liveChatMessages.list({
				liveChatId,
				part: ["snippet", "authorDetails"],
				pageToken: input.pageToken,
			});

			return {
				messages: chatResponse.data.items?.map((item) => ({
					id: item.id!,
					author: item.authorDetails?.displayName ?? "Anonymous",
					message: item.snippet?.displayMessage ?? "",
					timestamp: item.snippet?.publishedAt ?? new Date().toISOString(),
					sentiment: "neutral", // We'll implement sentiment analysis later
				})) ?? [],
				nextPageToken: chatResponse.data.nextPageToken,
				pollingIntervalMillis: chatResponse.data.pollingIntervalMillis,
			};
		}),
}); 