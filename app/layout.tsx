import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { EXOBOD_HERO_IMAGE } from "@/lib/site-assets";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://exobod.ai"),
  title: "Exobod.ai | Give Your Phone a Real Body",
  description:
    "Exobod.ai is a modular smartphone embodiment system that turns iPhone and Android devices into customizable AI-controlled robotic bodies.",
  openGraph: {
    title: "Exobod.ai | Give Your Phone a Real Body",
    description:
      "Modular smartphone exoskeleton system. Your phone stays the brain. Exobod becomes the body.",
    type: "website",
    url: "https://exobod.ai",
    images: [
      {
        url: EXOBOD_HERO_IMAGE,
        width: 900,
        height: 1200,
        alt: "Exobod modular smartphone embodiment concept",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Exobod.ai | Give Your Phone a Real Body",
    description:
      "Modular smartphone embodiment for iPhone and Android - preorder interest and prototype programs.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
