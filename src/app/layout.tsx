import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";

// Hedvig Letters Sans for body text
const hedvigSans = localFont({
  src: "../assets/fonts/HedvigLettersSans-Regular.ttf",
  variable: "--font-hedvig-sans",
});

// Using Hedvig Letters Serif from Google as no local file provided for it
import { Hedvig_Letters_Serif, Geist_Mono } from "next/font/google";

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
  title: "Illumi | Invoicing & Finance for South Africa",
  description: "Illumi helps you manage your invoicing and finances with ease.",
  icons: {
    icon: "/logo.png",
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
        className={`${hedvigSerif.variable} ${geistMono.variable} antialiased bg-black text-white font-serif`}
        suppressHydrationWarning
      >
        {children}
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
