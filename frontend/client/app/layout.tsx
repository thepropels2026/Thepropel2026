// Import Next.js Metadata type for SEO and page headers
import type { Metadata } from 'next'
// Import Google fonts using Next.js font optimization
import { Montserrat, Inter, Archivo } from 'next/font/google'
// Import global CSS styles
import './globals.css'
// Import core layout components
import Header from '../components/Header'
import Footer from '../components/Footer'
// Import Authentication context provider
import { AuthProvider } from '../components/AuthContext'
// Import icons from lucide-react
import { MessageCircle } from 'lucide-react'
// Import smooth scrolling utility component
import SmoothScroll from '../components/SmoothScroll'
// Import Global Register Modal
import RegisterModal from '../components/RegisterModal'

// Configure font subsets and weights, and define CSS variables for use in Tailwind/CSS
const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'], variable: '--font-montserrat' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' })
const archivo = Archivo({ subsets: ['latin'], weight: ['900'], variable: '--font-archivo' })

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
      <body className={`${montserrat.variable} ${inter.variable} ${archivo.variable} font-inter antialiased bg-background text-foreground`}>
        
        {/* Very subtle neutral background depth — no colour bleed */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-60">
          <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-[#0a0a0a] rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#080808] rounded-full blur-[200px]" />
        </div>
        
        {/* Enable smooth scrolling across the entire application */}
        <SmoothScroll>
          {/* Provide authentication state to all child components */}
          <AuthProvider>
            <div className="flex flex-col min-h-screen relative z-0">
              {/* Persistent Header */}
              <Header />
              
              {/* Global Registration Modal */}
              <RegisterModal />
              
              {/* Main content area where individual page components are rendered */}
              <main className="flex-grow">{children}</main>
              
              {/* Persistent Footer */}
              <Footer />
              
              {/* Global Floating Action Button for Help/Chat Support - Visible on all pages */}
              <div className="help-fab">
                 <MessageCircle className="w-8 h-8 text-white/70" />
              </div>
            </div>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
