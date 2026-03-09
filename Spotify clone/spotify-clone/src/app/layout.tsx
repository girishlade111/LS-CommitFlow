import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

// Load Figtree font with all weights
const figtree = Figtree({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spotify - Web Player",
  description: "Spotify - Web Player: Listen to your favorite songs online for free. Stream music and podcasts, discover albums, playlists or even single songs for free on Spotify.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Spotify - Web Player",
    description: "Listen to your favorite songs online for free",
    type: "website",
    locale: "en_US",
    siteName: "Spotify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify - Web Player",
    description: "Listen to your favorite songs online for free",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-figtree antialiased">
        <Providers>
          {children}
          {/* Toast notifications */}
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: "#333333",
                color: "#FFFFFF",
                borderRadius: "4px",
                fontSize: "14px",
                padding: "12px 16px",
              },
              duration: 3000,
              success: {
                iconTheme: {
                  primary: "#1DB954",
                  secondary: "#FFFFFF",
                },
              },
              error: {
                iconTheme: {
                  primary: "#E91429",
                  secondary: "#FFFFFF",
                },
              },
              loading: {
                iconTheme: {
                  primary: "#1DB954",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
