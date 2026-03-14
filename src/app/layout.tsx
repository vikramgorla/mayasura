import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mayasura.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Mayasura — Build Your Brand's Digital Palace",
    template: "%s | Mayasura",
  },
  description:
    "Launch your brand's complete digital presence in minutes. AI-powered website, shop, blog & chatbot. Open-source, free to start.",
  keywords: [
    "brand builder",
    "AI website builder",
    "open source",
    "digital presence",
    "e-commerce",
    "chatbot",
    "blog",
    "brand ecosystem",
    "no-code",
  ],
  authors: [{ name: "Mayasura", url: BASE_URL }],
  creator: "Mayasura",
  publisher: "Mayasura",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Mayasura",
    title: "Mayasura — Build Your Brand's Digital Palace",
    description:
      "Launch your brand's complete digital presence in minutes. AI-powered website, shop, blog & chatbot. Open-source, free to start.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mayasura — The divine architect of digital ecosystems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayasura — Build Your Brand's Digital Palace",
    description:
      "Launch your brand's complete digital presence in minutes. AI-powered, open-source.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@mayasura_app",
    site: "@mayasura_app",
  },
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
      </head>
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
