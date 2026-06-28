"use client";
import { React, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'



const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout();
    router.push('/login')
  }

  return (
    <header className="relative bg-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center ml-[-50px] lg:ml-[-100px]">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="" width={180} height={200} />
            </Link>
          </div>
          {/* router.push('/complaints/new') */}

          <nav className="hidden md:flex items-center space-x-6 text-slate-600">
            <Link href="/" className="hover:text-slate-800 font-bold">Home</Link>
            <Link href="/about" className="hover:text-slate-800 font-bold">About</Link>
            <Link href="/geomap" className="hover:text-slate-800 font-bold">Water Bodies Geo Map</Link>
            <Link href="/ai-analysis" className="hover:text-slate-800 font-bold">AI Analysis</Link>
            <Link href="/health-calculator" className="hover:text-slate-800 font-bold">WQI Calculator</Link>
            <Link href="/complaints/new" className="hover:text-slate-800 font-bold">Report Pollution</Link>
            <Link href="/other-state-data" className="hover:text-slate-800 font-bold">Other State Data</Link>
          </nav>
          {user ?
            <div className="hidden md:flex items-center space-x-3 mr-0">
              <Button onClick={handleLogout} variant="outline">Logout</Button>
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            </div>

            : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">Login</Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:brightness-95">Register</Link>
              </div>
            )}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#D96C2D] transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
              <nav className="flex flex-col p-4 space-y-1">
                <Link href="/" className="font-bold hover:text-slate-800">
                  Home
                </Link>
                <Link href="/about" className="font-bold hover:text-slate-800">
                  About
                </Link>
                <Link href="/geomap" className="font-bold hover:text-slate-800">
                  Water Bodies Geo Map
                </Link>
                <Link href="/ai-analysis" className="font-bold hover:text-slate-800">
                  AI Analysis
                </Link>
                <Link href="/health-calculator" className="font-bold hover:text-slate-800">
                  WQI Calculator
                </Link>
                <Link href="/complaints/new" className="font-bold hover:text-slate-800">
                  Report Pollution
                </Link>
                <Link href="/other-state-data" className="font-bold hover:text-slate-800">
                  Other State Data
                </Link>

                <hr />

                {user ? (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button onClick={handleLogout} variant="outline">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className="text-center px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
