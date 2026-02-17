import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.illumi.co.za"
  ),
  title: "Illumi | Free Invoice Generator & Professional Invoicing Software",
  description: "Create professional invoices online for free. Customizable invoice templates, automatic VAT calculations, expense tracking, and online payments. The best invoicing software for freelancers and small businesses in South Africa.",
  keywords: [
    "invoice generator",
    "free invoice generator",
    "invoice template",
    "free invoice template",
    "invoice creator",
    "invoice creator online",
    "invoice maker",
    "online invoicing",
    "online invoices",
    "invoicing software",
    "invoice software",
    "billing software",
    "create invoice online",
    "create invoice online free",
    "professional invoice template",
    "freelance invoice template",
    "small business invoice",
    "proforma invoice template",
    "proforma invoice generator",
    "receipt maker",
    "invoice generator South Africa",
    "VAT invoice generator",
    "VAT invoice template South Africa",
    "free invoice software South Africa",
    "invoice generator ZAR",
    "SMME invoicing software",
    "expense tracker",
    "invoice PDF generator",
    "send invoice online",
    "best invoicing software",
    "invoice app",
    "invoice management software",
    "recurring invoice software",
    "automated invoicing",
  ],
  openGraph: {
    title: "Illumi | Professional Invoicing for South African Businesses",
    description: "Create professional invoices in ZAR. 2 months of Pro features free for South African businesses.",
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Illumi",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Illumi | Professional Invoicing for South African Businesses",
    description: "Create professional invoices in ZAR. 2 months of Pro features free for South African businesses.",
    images: ["/logo.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Organization structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Illumi",
              url: "https://www.illumi.co.za",
              logo: "https://www.illumi.co.za/logo.png",
              description: "Professional invoicing software for South African freelancers and small businesses. Create invoices in ZAR, track expenses, and get paid online.",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://www.illumi.co.za/contact",
              },
            }),
          }}
        />
        {/* JSON-LD SoftwareApplication for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Illumi",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://www.illumi.co.za",
              description: "Free invoice generator and professional invoicing software. Create customizable invoice templates, track expenses, accept online payments, and manage your business finances.",
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "ZAR",
                  name: "Free Plan",
                  description: "Create unlimited invoices, track expenses, and manage clients for free.",
                },
                {
                  "@type": "Offer",
                  price: "149",
                  priceCurrency: "ZAR",
                  name: "Pro Plan",
                  description: "Online payments, recurring invoices, custom branding, and premium features.",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
                bestRating: "5",
                worstRating: "1",
              },
              featureList: "Invoice Generator, Invoice Templates, VAT Calculations, Expense Tracking, Online Payments, Recurring Invoices, Client Management, PDF Export, WhatsApp Sharing, Multi-Currency Support",
            }),
          }}
        />
        {/* Google Ads Conversion Tracking */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17895371637" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17895371637');
              
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                  'send_to': 'AW-17895371637/XFcrCJmX6e0bEPXmltVC',
                  'event_callback': callback
                });
                return false;
              }
            `,
          }}
        />
        {/* Theme initialization - default to light mode */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('illumi_theme');var isDark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(isDark){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}})();",
          }}
        />
      </head>
      <body
        className={`${hedvigSans.variable} ${hedvigSerif.variable} ${geistMono.variable} antialiased bg-background text-foreground font-serif`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
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
