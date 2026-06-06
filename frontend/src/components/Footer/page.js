import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white font-semibold text-lg">JalRakshak</h4>
          <p className="mt-2 text-sm text-slate-300">Delhi Water Bodies Real-Time Monitoring System. Ensuring the health and sustainable management of Delhi's blue infrastructure.</p>
        </div>

        <div>
          <h5 className="text-white font-medium">Quick Links</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/geomap" className="hover:underline">Water Bodies Geo Map</Link></li>
            <li><Link href="/reports" className="hover:underline">Reports</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-medium">Contact</h5>
          <p className="mt-3 text-sm text-slate-300">Email: info@jalrakshak.example</p>
          <p className="text-sm text-slate-300">Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-slate-700 mt-8 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">© {new Date().getFullYear()} JalRakshak. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default Footer
