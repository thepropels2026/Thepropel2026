import type { Metadata } from "next"; // Next.js specific metadata typing
import { Geist, Geist_Mono } from "next/font/google"; // Modern Geist font families
import "./globals.css"; // Admin-specific global styles

// Load Geist Sans font with variable CSS support
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load Geist Mono font for data/code elements
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata for the Admin portal
export const metadata: Metadata = {
  title: "Propels Admin | Command Center",
  description: "Internal management systems for the Propels ecosystem",
};

/**
 * RootLayout: Wraps the entire Admin interface.
 * Implements a full-height flex column for layout stability.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
