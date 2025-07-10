import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { StreamMonitor } from "./_components/stream-monitor";
import { Navbar } from "~/app/_components/navbar";

export default async function StreamPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const session = await auth();
	if (!session?.user) {
		redirect("/");
	}

	return (
		<HydrateClient>
			<div className="min-h-screen text-white bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<StreamMonitor streamId={id} />
				</main>
			</div>
		</HydrateClient>
	);
} 