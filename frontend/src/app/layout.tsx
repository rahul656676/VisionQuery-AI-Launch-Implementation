import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthBypass } from "@/components/AuthBypass";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisionQuery AI | See the Unseen",
  description: "Advanced AI Video and Image Analysis Platform. Extract insights, timelines, and bounding boxes instantly.",
  keywords: ["AI", "Video Analysis", "Image Analysis", "Object Detection", "Gemini AI"],
  openGraph: {
    title: "VisionQuery AI",
    description: "Advanced AI Video and Image Analysis Platform.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-gray-50">
        <AuthBypass />
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
