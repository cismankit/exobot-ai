import { LenisProvider } from "@/components/marketing/lenis-provider";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </LenisProvider>
  );
}
