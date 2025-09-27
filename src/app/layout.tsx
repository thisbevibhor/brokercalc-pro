import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BrokerCalc Pro",
	description: "Calculate your brokerage charges and P&L",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className="min-h-screen bg-gray-100">
					<Navigation />
					<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
				</div>
			</body>
		</html>
	);
}
