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
    <header className="bg-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center gap-2">
               <img src="/logo.png" alt="" width={180} height={200}/>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-slate-600">
            <Link href="/" className="hover:text-slate-800 font-bold">Home</Link>
            <Link href="/about" className="hover:text-slate-800 font-bold">About</Link>
            <Link href="/geomap" className="hover:text-slate-800 font-bold">Water Bodies Geo Map</Link>
            <Link href="/ai-analysis" className="hover:text-slate-800 font-bold">AI Analysis</Link>
            <Link href="/reports" className="hover:text-slate-800 font-bold">Reports</Link>
            <Link href="/contact" className="hover:text-slate-800 font-bold">Contact</Link>
          </nav>
          { user ? 
          <div className="flex items-center space-x-3">
              <Button onClick={handleLogout} variant="outline">Logout</Button>          
            </div>

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
