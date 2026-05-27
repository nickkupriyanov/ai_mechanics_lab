import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Mechanics Lab — Learn AI systems by breaking them",
    template: "%s — AI Mechanics Lab",
  },
  description:
    "Understand AI systems by interacting with them. Interactive visual explanations of RAG, embeddings, vector search, context windows, and tool calling.",
  keywords: [
    "AI", "RAG", "embeddings", "vector search", "context window",
    "tool calling", "machine learning", "interactive learning",
    "AI education", "LLM", "prompt engineering",
  ],
  authors: [{ name: "AI Mechanics Lab" }],
  openGraph: {
    title: "AI Mechanics Lab",
    description:
      "Learn AI systems by breaking them. Interactive visual playground for modern AI concepts.",
    type: "website",
    siteName: "AI Mechanics Lab",
  },
  alternates: {
    languages: {
      ru: "/ru",
      en: "/en",
    },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
