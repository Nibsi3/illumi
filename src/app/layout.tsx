import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsTracker } from "@/components/analytics-tracker";

import localFont from "next/font/local";
import {
  Geist_Mono,
  Hedvig_Letters_Serif,
} from "next/font/google";

const hedvigSans = localFont({
  src: "./fonts/HedvigLettersSans-Regular.ttf",
  variable: "--font-hedvig-sans",
});

const hedvigSerif = Hedvig_Letters_Serif({
  variable: "--font-hedvig-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://illumi.co.za"),
  title: "Illumi | Professional Invoicing for South African Businesses",
  description: "Create professional invoices in ZAR, track expenses, and get paid online. Built for South African freelancers and small businesses — VAT optional.",
  keywords: [
    "invoice generator South Africa",
    "professional invoice South Africa",
    "VAT invoice generator South Africa",
    "free invoice software South Africa",
    "invoice generator ZAR",
    "SMME invoicing software",
    "freelance invoice template South Africa",
    "online invoice payment South Africa",
    "expense tracker South Africa",
    "proforma invoice South Africa",
  ],
  openGraph: {
    title: "Illumi | Professional Invoicing for South African Businesses",
    description: "Create professional invoices in ZAR. Free forever for South African businesses.",
    type: "website",
    locale: "en_ZA",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
      },
    ],
    apple: [
      {
        url: "/favicon.ico",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${hedvigSans.variable} ${hedvigSerif.variable} ${geistMono.variable} antialiased bg-background text-foreground font-serif`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <AnalyticsTracker />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-center"
          expand
          visibleToasts={6}
          toastOptions={{
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  );
}
