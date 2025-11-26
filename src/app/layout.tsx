import type { Metadata } from "next";
import "./globals.css";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Korea News Aggregator",
  description: "Latest news from Korea's top English newspapers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50">
        <nav className="fixed top-0 left-0 right-0 z-50 glass-header h-16 flex items-center justify-center px-4">
          <div className="flex items-center space-x-3">
            <Newspaper className="w-6 h-6 text-slate-900" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-serif">
              KOREA NEWS <span className="text-slate-400 font-light font-sans">AGGREGATOR</span>
            </h1>
          </div>
        </nav>
        <main className="pt-20 pb-10 min-h-screen">
          {children}
        </main>
        <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
          <p>2025 Korea News Aggregator. Copyright © Jinwoo Hong. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
