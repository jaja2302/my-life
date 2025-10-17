import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import AudioPlayer from "@/components/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Our Love Story 💕",
  description: "A beautiful timeline of our love story, filled with memories, photos, and promises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider>
          <div className="min-h-screen">
            {children}
            <AudioPlayer 
              src="/songs/videoplayback.m4a" 
              title="Our Love Song 💕"
              autoplay={true}
            />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
