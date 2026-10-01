'use client'

import React from 'react'
import { MapPin } from 'lucide-react'

export default function RealTimeMapView() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Delhi Water Bodies Real-Time Geo Map</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Interactive GIS monitoring of all water bodies with live quality markers
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="w-full h-[520px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1BjMwuPVlftwaPaop5GfE_hJPU_d1oaYv&ehbc=2E312F"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title="Delhi Water Bodies Map"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Healthy</p>
              <p className="text-[10px] text-emerald-700">Normal status</p>
            </div>
          </div>

          <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-sky-900">Good</p>
              <p className="text-[10px] text-sky-700">Observation</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Poor</p>
              <p className="text-[10px] text-amber-700">Elevated pollution</p>
            </div>
          </div>

          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">Critical</p>
              <p className="text-[10px] text-rose-700">Needs intervention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
