import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque  } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});


export const metadata: Metadata = {
	title: "Agent Daddie",
	description: "Deploy Open Claw on your own server in minutes with just few clicks. No technical knowledge needed.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link> */}
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased dark`}>{children}</body>
		</html>
	);
}
