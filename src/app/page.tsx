import { Navbar } from "./_components/navbar";
import { HeroSection } from "./_components/hero-section";
import { HowItWorksSection } from "./_components/how-it-works";
import { UseCasesSection } from "./_components/use-case-section";
import { GetStartedSection } from "./_components/get-started-section";
import { Footer } from "./_components/footer";
import { auth } from "~/server/auth";

export default async function Home() {
	const session = await auth()
	return (
		<>
			<Navbar session={session || null} />
			<main className="flex flex-col items-center w-full">
				<HeroSection />
				<HowItWorksSection />
				<UseCasesSection />
				<GetStartedSection />
			</main>
			<Footer />
		</>
	);
}
