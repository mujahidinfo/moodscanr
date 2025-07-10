import "~/styles/globals.css";

import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Bricolage_Grotesque, Montserrat } from "next/font/google";

export const metadata: Metadata = {
	title: "MoodScanr - YouTube Live Sentiment Analysis",
	description: "Real-time sentiment analysis for your YouTube live streams",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
});

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${montserrat.variable} ${bricolage.variable}`}>
			<body>
				<TRPCReactProvider>
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}
