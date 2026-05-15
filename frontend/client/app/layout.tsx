// Import Next.js Metadata type for SEO and page headers
// Build Trigger: 2026-05-06 21:05 (Force Rebuild)
import type { Metadata } from 'next'
// Import Google fonts using Next.js font optimization
import { Montserrat, Inter, Archivo, Roboto } from 'next/font/google'
// Import global CSS styles
import './globals.css'
// Import core layout components
import Header from '../components/Header'
import Footer from '../components/Footer'
// Import Authentication context provider
import { AuthProvider } from '../components/AuthContext'
// Import Cart context provider
import { CartProvider } from '../context/CartContext'
// Import icons from lucide-react
import { MessageCircle } from 'lucide-react'
// Import smooth scrolling utility component
import SmoothScroll from '../components/SmoothScroll'
// Import Global Register & Login Modals
import RegisterModal from '../components/RegisterModal'
import LoginModal from '../components/LoginModal'
import CartDrawer from '../components/CartDrawer'

// Configure font subsets and weights, and define CSS variables for use in Tailwind/CSS
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-montserrat' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-inter' })
const archivo = Archivo({ subsets: ['latin'], weight: ['900'], variable: '--font-archivo' })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-roboto' })

// Define global metadata for the application (Title, Description, SEO)
export const metadata: Metadata = {
  title: 'The Propels | Future of Startups',
  description: 'Turning India\'s 75% students Entrepreneurial intents into Real world Revenue',
}

/**
 * RootLayout: The top-level layout component that wraps every page in the application.
 * Handles fonts, background gradients, smooth scrolling, and global context providers.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async></script>
      </head>
      {/* Apply configured fonts and antialiasing to the body */}
      <body className={`${montserrat.variable} ${inter.variable} ${archivo.variable} ${roboto.variable} font-montserrat antialiased bg-background text-foreground`}>
        
        {/* Vibrant background depth with colorful orbs */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 bg-purple-600/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-orange-500/10 rounded-full blur-[150px]" />
        </div>
        
        {/* Enable smooth scrolling across the entire application */}
        <SmoothScroll>
          {/* Provide authentication state to all child components */}
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen relative z-0">
                {/* Persistent Header */}
                <Header />
                
                {/* Global Modals */}
                <RegisterModal />
                <LoginModal />
                <CartDrawer />
                
                {/* Main content area where individual page components are rendered */}
                <main className="flex-grow">{children}</main>
                
                {/* Persistent Footer */}
                <Footer />
                
                {/* Global Floating Action Button for Help/Chat Support - Visible on all pages */}
                <div className="help-fab">
                   <MessageCircle className="w-8 h-8 text-white/70" />
                </div>
              </div>
            </CartProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
