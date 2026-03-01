import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Commit Tool",
  description: "A tool for learning GitHub API automation.",
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
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-[#30363d] p-4 text-center text-sm text-[#8b949e]">
            <p>Built for learning GitHub API automation.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
