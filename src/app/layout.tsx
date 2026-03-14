import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mayasura — Build Your Brand's Digital Palace",
  description: "The open-source framework that lets any brand instantiate their complete digital consumer communication ecosystem in one click.",
  openGraph: {
    title: "Mayasura — Build Your Brand's Digital Palace",
    description: "The open-source framework that lets any brand instantiate their complete digital consumer communication ecosystem in one click.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
