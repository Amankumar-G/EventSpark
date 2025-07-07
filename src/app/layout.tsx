import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header /> {/* Now it's fixed for all pages */}

          <main className="flex-1">{children}</main>

          <Footer /> {/* Fixed across all pages */}
        </body>
      </html>
    </ClerkProvider>
  );
}