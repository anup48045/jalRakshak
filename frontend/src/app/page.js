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
      <HeroSlider />
      <section className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 m-2">

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-[#003366]">624+</h3>
            <p className="text-slate-600 mt-2">Total Water Bodies</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-[#003366]">450+</h3>
            <p className="text-slate-600 mt-2">Actively Monitored</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-[#003366]">24×7</h3>
            <p className="text-slate-600 mt-2">Monitoring System</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-[#003366]">100%</h3>
            <p className="text-slate-600 mt-2">GIS Coverage</p>
          </div>

        </div>
      </section>
      {/* Platform Overview Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#003366] text-white rounded-lg p-8">

          <h2 className="text-3xl font-bold">
            JalRakshak Water Monitoring Platform
          </h2>

          <p className="mt-4 text-slate-200 max-w-4xl leading-7">
            Integrated monitoring and management system for Delhi's lakes,
            ponds, reservoirs, wetlands, and river ecosystems. The platform
            combines GIS mapping, real-time monitoring, AI-assisted analysis,
            and citizen participation to support sustainable water resource
            management.
          </p>

        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Panel */}
        <aside>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">

            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              Platform Overview
            </h2>

            <p className="text-slate-600 leading-7">
              JalRakshak provides continuous monitoring, GIS-based
              visualization, pollution tracking, citizen reporting,
              digital surveys, and AI-powered environmental analysis
              for water bodies across Delhi.
            </p>

            <div className="mt-6">
              <img
                src="/images/water2.jpeg"
                alt="Delhi Water Bodies"
                className="w-full h-[160px] object-cover rounded-lg"
              />
            </div>

            <div className="mt-4 border-t pt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Total Water Bodies:</span> 624+
              </p>
              <p>
                <span className="font-semibold">Monitored:</span> 450+
              </p>
              <p>
                <span className="font-semibold">Coverage:</span> NCT Delhi
              </p>
            </div>

          </div>

        </aside>

        {/* Right Side Features */}
        <div className="lg:col-span-2">

          <h2 className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all text-3xl font-bold text-[#003366] mb-6 text-center">
            Core Functional Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all">
              <h4 className="font-semibold text-lg">
                📈 Real-Time Monitoring
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Continuous monitoring of water quality and environmental
                indicators with automated alerts.
              </p>
            </div>

            <Link
              href="/geomap"
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-lg">
                🗺️ GIS Mapping Portal
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Interactive geospatial visualization of water body locations
                and health indicators.
              </p>
            </Link>

            <Link
              href="/complaints/new"
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-lg">
                👥 Citizen Reporting
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Submit pollution reports, complaints, and environmental
                observations.
              </p>
            </Link>

            <Link
              href="/surveys"
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-lg">
                📋 Digital Surveys
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Collect field observations and geo-tagged survey data
                digitally.
              </p>
            </Link>

            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all">
              <h4 className="font-semibold text-lg">
                🚨 Smart Alert System
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                Automated alerts for pollution, contamination,
                encroachment, and critical events.
              </p>
            </div>

            <Link
              href="/ai-analysis"
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#005B96] hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-lg">
                🤖 AI Pollution Detection
              </h4>
              <p className="mt-3 text-sm text-slate-600">
                AI-assisted analysis of uploaded images to identify
                waste, sewage, and pollution sources.
              </p>
            </Link>
            
          
            
          </div>
          
        </div>

        
      </section>
      {/* <div className='rounded-lg bg-white shadow p-3 sm:p-4 mt-5 max-w-[1220px] m-auto hover:bg-white/30'>
        <h2 className='font-bold text-3xl text-center justify-center m-auto'>Key Features</h2>
      </div> */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-3">
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
            <Link href="/complaints/new" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </Link>
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
            <Link href="/complaints/new" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </Link>
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
            <Link href="/complaints/new" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h4 className="font-semibold">Community Reporting</h4>
              <p className="mt-2 text-sm text-slate-600">Report pollution or issues and contribute to monitoring efforts.</p>
            </Link>
          </div>
        </div>


      </section> */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className=" bg-[#003366] text-white rounded-lg p-10 text-center">
          <h3 className="font-semibold text-xl"> Public Participation Portal</h3>
          <p className="mt-2 text-slate-200">
            Citizens can contribute by reporting pollution incidents,
            sharing observations, and supporting the protection of
            Delhi's water resources.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-[#003366] rounded-md font-semibold hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-6 py-3 border border-white rounded-md hover:bg-white/10"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
