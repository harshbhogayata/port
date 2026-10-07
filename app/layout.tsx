import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import SmoothScroll from "@/components/chrome/SmoothScroll";
import TransitionProvider from "@/components/chrome/Transition";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import Cursor from "@/components/chrome/Cursor";
import CommandPalette from "@/components/chrome/CommandPalette";
import SpecMode from "@/components/chrome/SpecMode";
import Preloader from "@/components/chrome/Preloader";
import Toast from "@/components/chrome/Toast";
import ConsoleHello from "@/components/chrome/ConsoleHello";
import { profile } from "@/content/profile";
import { bootScript } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name}, ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.positioning,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name}, ${profile.role}`,
    description: profile.positioning,
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#061029" },
  ],
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.site,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.pl{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <TransitionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CommandPalette />
        </TransitionProvider>
        <SpecMode />
        <Cursor />
        <Toast />
        <ConsoleHello />
        <Preloader />
      </body>
    </html>
  );
}
