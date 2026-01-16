import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";

// Hedvig Letters Sans for body text is now loaded via globals.css @font-face


// Using Hedvig Letters Serif from Google as no local file provided for it
// Google Fonts are now loaded via globals.css @import

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
        className="antialiased bg-black text-white font-serif"
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
