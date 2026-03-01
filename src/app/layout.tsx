import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Commit Tool - Educational Git Automation",
  description: "An educational tool for learning GitHub API automation. For educational purposes only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-[#30363d] bg-[#161b22] p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-semibold text-[#58a6ff]">
                Git Commit Tool
              </h1>
              <span className="text-xs text-[#d29922] bg-[#d29922]/10 px-2 py-1 rounded">
                Educational Use Only
              </span>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-[#30363d] p-4 text-center text-sm text-[#8b949e]">
            <p>Built for educational purposes. Respect GitHub API rate limits.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
