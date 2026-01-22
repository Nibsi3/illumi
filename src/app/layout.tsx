import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import localFont from "next/font/local";
import {
  Geist_Mono,
  Hedvig_Letters_Serif,
  Lato,
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Roboto,
  Roboto_Slab,
  Source_Sans_3,
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

const invoiceMontserrat = Montserrat({
  variable: "--font-invoice-montserrat",
  subsets: ["latin"],
});

const invoiceRobotoSlab = Roboto_Slab({
  variable: "--font-invoice-roboto-slab",
  subsets: ["latin"],
});

const invoiceLato = Lato({
  variable: "--font-invoice-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const invoicePlayfair = Playfair_Display({
  variable: "--font-invoice-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const invoiceSourceSans = Source_Sans_3({
  variable: "--font-invoice-source-sans",
  subsets: ["latin"],
});

const invoiceOpenSans = Open_Sans({
  variable: "--font-invoice-open-sans",
  subsets: ["latin"],
});

const invoicePoppins = Poppins({
  variable: "--font-invoice-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const invoiceRoboto = Roboto({
  variable: "--font-invoice-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Illumi | SARS-Compliant Invoice Generator for South Africa",
  description: "Create SARS-compliant tax invoices with VAT, track expenses, and get paid online in ZAR. Free invoicing software for South African SMMEs, freelancers, and contractors in Johannesburg, Cape Town, Durban.",
  keywords: [
    "SARS compliant invoice generator",
    "tax invoice South Africa",
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
    title: "Illumi | SARS-Compliant Invoice Generator for South Africa",
    description: "Create professional tax invoices in ZAR. Free forever for South African businesses.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${hedvigSans.variable} ${hedvigSerif.variable} ${geistMono.variable} ${invoiceMontserrat.variable} ${invoiceRobotoSlab.variable} ${invoiceLato.variable} ${invoicePlayfair.variable} ${invoiceSourceSans.variable} ${invoiceOpenSans.variable} ${invoicePoppins.variable} ${invoiceRoboto.variable} antialiased bg-background text-foreground font-serif`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  );
}
