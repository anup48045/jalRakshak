"use client";
import React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'



const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">JR</div>
              <span className="font-semibold text-lg text-slate-700">JalRakshak</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-slate-600">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <Link href="/about" className="hover:text-slate-800">About</Link>
            <Link href="/geomap" className="hover:text-slate-800">Water Bodies Geo Map</Link>
            <Link href="/reports" className="hover:text-slate-800">Reports</Link>
            <Link href="/contact" className="hover:text-slate-800">Contact</Link>
          </nav>
          { user ? 
          <div className="flex items-center space-x-3">
              <Button onClick={handleLogout} variant="outline">Logout</Button>          </div>

          : (
            <div className="flex items-center space-x-3">
              <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:brightness-95">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
