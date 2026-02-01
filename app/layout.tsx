import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "RollCall+ by Marvin Villaluz",
  description: "Premium Gamified Attendance Dashboard",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-dark-950 min-h-screen text-white antialiased font-sans selection:bg-primary-500/30 flex flex-col" suppressHydrationWarning>
        <Providers>
          <div className="flex-grow">
            {children}
          </div>
          <footer className="py-6 text-center text-dark-text-muted text-sm border-t border-white/5 mt-auto">
            <p>Made by <span className="text-white font-medium">Marvin Villaluz</span> 🚀</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
