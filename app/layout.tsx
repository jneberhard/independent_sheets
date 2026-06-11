import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from './context/CartContext';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Independent Sheets",
  description: "Sheet music by creators for artists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-screen flex-col">
        {/* CartProvider wraps everything inside the body safely */}
        <CartProvider>
          <Header />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </CartProvider> {/* <-- Properly closed at the very bottom */}
      </body>
    </html>
  );
}
