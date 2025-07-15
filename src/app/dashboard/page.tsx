import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { LiveStreams } from "./_components/live-streams";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <HydrateClient>
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">
              SELECT A STREAM
            </h1>
          </div>

          <LiveStreams />
        </div>
      </div>
    </HydrateClient>
  );
}
