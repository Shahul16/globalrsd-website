import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollProgress from "@/components/ScrollProgress";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Globalrsd — Global Institute of Research & Skills Development",
    template: "%s | Globalrsd",
  },
  description:
    "The Global Institute of Research & Skills Development (Globalrsd) delivers international research conferences, skills workshops, online courses, awards and professional membership. Based in London, serving a growing international community.",
  keywords: [
    "research conference UK",
    "academic conference London",
    "skills development",
    "online courses",
    "academic awards",
    "professional membership",
    "Globalrsd",
  ],
  openGraph: {
    type: "website",
    siteName: "Globalrsd",
    title: "Global Institute of Research & Skills Development",
    description:
      "International research conferences, skills workshops, online courses, awards and professional membership.",
    url: SITE.domain,
    images: ["/og-banner.jpg"],
  },
  twitter: {
    card: "summary",
    title: "Globalrsd — Global Institute of Research & Skills Development",
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
