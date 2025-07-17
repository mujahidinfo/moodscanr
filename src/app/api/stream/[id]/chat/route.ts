import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
	request: NextRequest
) {
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			// Set up headers for SSE
			const headers = new Headers();
			headers.set("Content-Type", "text/event-stream");
			headers.set("Cache-Control", "no-cache");
			headers.set("Connection", "keep-alive");

			// In a real implementation, this would connect to YouTube's live chat API
			// For now, we'll just send some mock messages
			const mockMessages = [
				{
					id: "1",
					author: "User1",
					message: "This is great!",
					timestamp: new Date().toISOString(),
					sentiment: "positive",
				},
				{
					id: "2",
					author: "User2",
					message: "I'm not sure about this...",
					timestamp: new Date().toISOString(),
					sentiment: "negative",
				},
				{
					id: "3",
					author: "User3",
					message: "What's happening?",
					timestamp: new Date().toISOString(),
					sentiment: "neutral",
				},
			];

			// Send mock messages every 2 seconds
			for (const message of mockMessages) {
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
				);
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}

			// Keep the connection alive
			const keepAlive = setInterval(() => {
				controller.enqueue(encoder.encode(": keepalive\n\n"));
			}, 30000);

			// Clean up on close
			request.signal.addEventListener("abort", () => {
				clearInterval(keepAlive);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
} 