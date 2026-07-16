import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollProgress from "@/components/ScrollProgress";
import { AuthProvider } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "GIRSD — Global Institute of Research & Skills Development",
    template: "%s | GIRSD",
  },
  description:
    "The Global Institute of Research & Skills Development (GIRSD) delivers international research conferences, skills workshops, online courses, awards and professional membership. Based in London, serving a community across 47 countries.",
  keywords: [
    "research conference UK",
    "academic conference London",
    "skills development",
    "online courses",
    "academic awards",
    "professional membership",
    "GIRSD",
  ],
  openGraph: {
    type: "website",
    siteName: "GIRSD",
    title: "Global Institute of Research & Skills Development",
    description:
      "International research conferences, skills workshops, online courses, awards and professional membership.",
    url: SITE.domain,
  },
  twitter: {
    card: "summary",
    title: "GIRSD — Global Institute of Research & Skills Development",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body>
        <AuthProvider>
          <LoadingScreen />
          <ScrollProgress />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
