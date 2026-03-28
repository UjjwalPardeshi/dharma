import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Divya Gyan — Mythological AI Life Consultant",
  description:
    "Ancient wisdom. Modern clarity. Life solutions rooted in timeless truth. Get personalized life guidance from the world's mythological traditions.",
  keywords: [
    "AI life consultant",
    "mythological wisdom",
    "Bhagavad Gita",
    "spiritual guidance",
    "ancient wisdom",
    "life advice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${crimsonText.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
