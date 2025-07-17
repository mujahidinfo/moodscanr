"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface LiveStream {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  duration: string;
}

// const mockStreams = [
//   {
//     id: "1",
//     title: "Live Stream 1",
//     thumbnailUrl: "https://placehold.co/600x400",
//     viewerCount: 100,
//     duration: "10:00",
//   },
//   {
//     id: "2",
//     title: "Live Stream 2",
//     thumbnailUrl: "https://placehold.co/600x400",
//     viewerCount: 200,
//     duration: "20:00",
//   },
//   {
//     id: "3",
//     title: "Live Stream 3",
//     thumbnailUrl: "https://placehold.co/600x400",
//     viewerCount: 300,
//     duration: "30:00",
//   },
// ];

export function LiveStreams() {
  const router = useRouter();
  const {
    data: streams,
    isLoading,
    error,
  } = api.youtube.getLiveStreams.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white/5 p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold text-red-400">
          There was an error
        </h3>
        <p className="text-gray-400">Please try again later.</p>
        <a
          href="https://www.youtube.com/features"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium hover:bg-white/20"
        >
          Go to YouTube
        </a>
      </div>
    );
  }

  if (!streams?.length) {
    return (
      <div className="rounded-lg bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442] p-8 text-center min-h-[500px]">
        <h2 className="text-5xl font-bold text-white mb-10">Live Streams</h2>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No Active Streams
        </h3>
        <p className="text-white">
          You don't have any active live streams at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442] md:px-10 px-4 pb-10">
      <h2 className="text-5xl text-center font-bold text-white md:py-8 py-6">
        Live Streams
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:px-10 px-0">
        {streams?.map((stream: LiveStream) => (
          <button
            key={stream.id}
            onClick={() => router.push(`/stream/${stream.id}`)}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold line-clamp-2 text-white text-xl">
                  {stream.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
