import type { Metadata } from "next";
import { Montserrat, Inter, Archivo } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'], variable: '--font-montserrat' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' });
const archivo = Archivo({ subsets: ['latin'], weight: ['900'], variable: '--font-archivo' });

export const metadata: Metadata = {
  title: "The Propels | Admin Portal",
  description: "Admin Portal for The Propels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} ${archivo.variable} font-inter antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        {/* Global Multi-color texture background */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 bg-purple-600/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-orange-500/10 rounded-full blur-[150px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
