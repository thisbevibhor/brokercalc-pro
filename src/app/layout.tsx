import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClientLayout } from "./client-layout";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
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
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} font-sans`}>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
