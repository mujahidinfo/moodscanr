"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { api } from "~/trpc/react";

interface ChatMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

export function StreamMonitor({ streamId }: { streamId: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const { data: streamInfo } = api.youtube.getStreamInfo.useQuery({ streamId });

  // Calculate sentiment statistics
  const sentimentStats = useMemo(() => {
    const total = messages.length;
    if (total === 0) return { positive: 0, neutral: 0, negative: 0 };

    const counts = messages.reduce(
      (acc, msg) => {
        acc[msg.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    return {
      positive: Math.round((counts.positive / total) * 100),
      neutral: Math.round((counts.neutral / total) * 100),
      negative: Math.round((counts.negative / total) * 100),
    };
  }, [messages]);

  // Calculate overall sentiment score for the heatmap
  const overallSentiment = useMemo(() => {
    if (messages.length === 0) return 50; // Default to middle if no messages

    const scores = messages.reduce((acc, msg) => {
      switch (msg.sentiment) {
        case "positive":
          return acc + 1;
        case "negative":
          return acc - 1;
        default:
          return acc;
      }
    }, 0);

    // Convert to percentage (0-100)
    const normalizedScore = ((scores / messages.length + 1) / 2) * 100;
    return Math.min(Math.max(normalizedScore, 0), 100); // Clamp between 0-100
  }, [messages]);

  useEffect(() => {
    if (!streamInfo) return;

    // Initialize SSE connection
    const eventSource = new EventSource(`/api/chat/${streamId}`);

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setIsConnected(true);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setIsConnected(false);
      eventSource.close();
    };

    eventSource.onmessage = (event) => {
      if (event.data === "connected") return;

      try {
        const data = JSON.parse(event.data);
        if (isPaused) return;

        // Handle error messages
        if (data.error) {
          console.error("Stream error:", data.error);
          return;
        }

        // Ensure we have messages array
        const newMessages = data.messages || [];
        if (!Array.isArray(newMessages)) {
          console.error("Invalid messages format:", data);
          return;
        }

        setMessages((prev) => {
          const uniqueMessages = newMessages.filter(
            (msg) => !prev.some((p) => p.id === msg.id)
          );
          return [...uniqueMessages, ...prev].slice(0, 100); // Keep last 100 messages
        });
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // Cleanup function
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [streamId, streamInfo, isPaused]);

  if (!streamInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-900/50 border-t-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src={streamInfo.thumbnailUrl}
              alt="Stream Thumbnail"
              width={150}
              height={150}
              className="rounded-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl mb-2">
              {streamInfo.title}
            </h1>
            <p className="text-gray-400">
              {streamInfo.viewerCount.toLocaleString()} watching
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="rounded-full bg-gray-800/10 px-6 py-2 font-medium hover:bg-gray-800/20"
          >
            {isPaused ? "Resume Analysis" : "Pause Analysis"}
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-full bg-gray-800/10 px-6 py-2 font-medium hover:bg-gray-800/20"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sentiment Heatmap */}
        <div className="rounded-lg bg-gray-500/5 p-6 border border-gray-900/10">
          <h2 className="mb-4 text-xl font-semibold">Live Sentiment</h2>
          <div className="h-4 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallSentiment}%`,
                backgroundColor:
                  overallSentiment > 50
                    ? `rgb(${255 - (overallSentiment - 50) * 5}, 255, 0)`
                    : `rgb(255, ${overallSentiment * 5}, 0)`,
              }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Overall sentiment: {overallSentiment.toFixed(1)}%
          </p>
        </div>

        {/* Sentiment Breakdown */}
        <div className="rounded-lg bg-gray-500/5 p-6 border border-gray-900/10">
          <h2 className="mb-4 text-xl font-semibold">Sentiment Breakdown</h2>
          <div className="space-y-4">
            {/* Positive Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-500">
                  Positive
                </span>
                <span className="text-sm font-semibold text-green-500">
                  {sentimentStats.positive}%
                </span>
              </div>
              <div className="w-full h-4 bg-green-500/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.positive}%` }}
                ></div>
              </div>
            </div>
            {/* Neutral Bar */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-400">
                  Neutral
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  {sentimentStats.neutral}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-300 to-gray-500 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.neutral}%` }}
                ></div>
              </div>
            </div>
            {/* Negative Bar */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-red-500">
                  Negative
                </span>
                <span className="text-sm font-semibold text-red-500">
                  {sentimentStats.negative}%
                </span>
              </div>
              <div className="w-full h-4 bg-red-500/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${sentimentStats.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="rounded-lg bg-gray-500/5 p-6 border border-gray-900/10">
          <h2 className="mb-4 text-xl font-semibold">Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {isPaused && (
            <div className="mt-2 text-sm text-yellow-500">Analysis paused</div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="rounded-lg bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Live Chat</h2>
        <div className="h-[400px] space-y-2 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-3 ${
                message.sentiment === "positive"
                  ? "bg-green-500/10"
                  : message.sentiment === "negative"
                  ? "bg-red-500/10"
                  : "bg-gray-500/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{message.author}</span>
                <span className="text-sm text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1">{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 