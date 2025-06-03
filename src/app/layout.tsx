import type { Metadata } from "next";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "NiceJob - AI-Powered Job Preparation",
  description: "Optimize your CV, generate interview questions, and land your dream job with AI-powered tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-foreground font-sans">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
