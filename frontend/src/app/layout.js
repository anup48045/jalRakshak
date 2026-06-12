import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar/page'
import Footer from '@/components/Footer/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JalRakshak - Water Body Monitoring System',
  description: 'Real-Time Survey & Monitoring of Water Bodies in Delhi - SIH 2024',
  icons:{
    icon:{url: '/logo2.jpg', sizes: '192x192', type: 'image/jpg'},
    // shortcut: '/logo2.jpg',
    // apple: '/logo2.jpg',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
