import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

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
			<head>
				<meta name="color-scheme" content="light dark" />
				<meta name="theme-color" content="#2563EB" media="(prefers-color-scheme: light)" />
				<meta name="theme-color" content="#3B82F6" media="(prefers-color-scheme: dark)" />
			</head>
			<body className="font-sans">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
