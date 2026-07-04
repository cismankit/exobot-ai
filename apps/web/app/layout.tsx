import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@exobod/ui/tokens.css";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Exobod — Give your phone a real body",
  description:
    "Your phone is already the smartest thing you own. Exobod gives it eyes, a neck, and a voice — a servo body driven by a federation of AI minds behind one persona, governed by a safety-clamping controller.",
  metadataBase: new URL("https://www.exobod.ai"),
  openGraph: {
    title: "Exobod — Give your phone a real body",
    description:
      "Phone as brain. Frame as body. One persona, many minds, a constitution in silicon.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
