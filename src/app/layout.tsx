import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";
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
  title: "Illumi | Invoicing for South African SMMEs",
  description: "Create professional tax invoices, calculate 15% VAT, and get paid online in ZAR. Built for South African SMMEs, freelancers, and contractors.",
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
        className={`${hedvigSans.variable} ${hedvigSerif.variable} ${geistMono.variable} ${invoiceMontserrat.variable} ${invoiceRobotoSlab.variable} ${invoiceLato.variable} ${invoicePlayfair.variable} ${invoiceSourceSans.variable} ${invoiceOpenSans.variable} ${invoicePoppins.variable} ${invoiceRoboto.variable} antialiased bg-black text-white font-serif`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  );
}
