'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import HeroSlider from '@/components/HeroSlider/page'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })
const HeatMap = dynamic(() => import('@/components/HeatMap/page'), {
  ssr: false,
})
{/* <div className="rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Water Bodies Geo Map</h3>
            </div>
            <div className="p-6 mt-10">
              <div className="w-full h-80 rounded-md flex items-center justify-center">
                {/* <HeatMap/> */}
          //     </div>
          //   </div>
          // </div> */}

export default function Home() {
  return (
    <div className="home bg-gradient-to-r from-blue-600 via-gray-700 to-cyan-400">
      <HeroSlider/>
      <div className='rounded-lg bg-white shadow p-3 sm:p-4 mt-5 max-w-[1220px] m-auto hover:bg-white/30'>
       <h2 className='font-bold text-3xl text-center justify-center m-auto'>Key Features</h2>
      </div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-3">
        <aside>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-lg">Key Features</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Real-Time Data from sensors</li>
              <li>Map Visualization & Status</li>
              <li>Pollution Tracking & Alerts</li>
              <li>Community Reporting</li>
            </ul>
            <div className="mt-6">
              <h5 className="font-medium">Delhi Water Bodies</h5>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="rounded overflow-hidden">
                  <img src="/images/water2.jpeg" alt="waterbody" width={600} height={360} className="object-cover w-full h-32 rounded" />
                </div>
                <div className="text-sm text-slate-600">Total Water Bodies: 450+</div>
                <div className="text-sm text-slate-600">Monitored: 320+</div>
              </div>
            </div>
          </div>
        </aside>
        <div className="lg:col-span-2">
          

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Real-Time Data</h4>
              <p className="mt-2 text-sm text-slate-600">Sensor feeds and continuous readings for water quality parameters.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Map Visualization</h4>
              <p className="mt-2 text-sm text-slate-600">Interactive map with status markers and historical trends.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Real-Time Data</h4>
              <p className="mt-2 text-sm text-slate-600">Sensor feeds and continuous readings for water quality parameters.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Map Visualization</h4>
              <p className="mt-2 text-sm text-slate-600">Interactive map with status markers and historical trends.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Real-Time Data</h4>
              <p className="mt-2 text-sm text-slate-600">Sensor feeds and continuous readings for water quality parameters.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Map Visualization</h4>
              <p className="mt-2 text-sm text-slate-600">Interactive map with status markers and historical trends.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </div>
          </div>
        </div>

        
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className=" bg-white rounded-lg shadow p-6 text-center">
          <h3 className="font-semibold text-xl">Get Involved</h3>
          <p className="mt-2 text-slate-600">Join the community to help protect and monitor Delhi's water bodies. Report issues, view data, and collaborate.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-md">Login</Link>
            <Link href="/register" className="px-5 py-2 border border-slate-300 rounded-md">Register</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
