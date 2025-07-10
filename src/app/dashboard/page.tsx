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
			<main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container mx-auto px-4 py-8">
					<div className="mb-8">
						<h1 className="text-4xl font-bold">Dashboard</h1>
						<p className="text-gray-300">Select a live stream to monitor</p>
					</div>

					<LiveStreams />
				</div>
			</main>
		</HydrateClient>
	);
} 