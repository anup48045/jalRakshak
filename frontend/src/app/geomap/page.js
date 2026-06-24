import React from 'react'

const RealTimeMap = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Real-Time Monitoring Map</h1>
          <p className="mt-2 text-slate-600">Explore the live water body monitoring map for Delhi.</p>
        </div>

        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg bg-white">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1BjMwuPVlftwaPaop5GfE_hJPU_d1oaYv&ehbc=2E312F"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title="Delhi Water Bodies Real-Time Map"
          ></iframe>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Healthy</p>
                  <p className="mt-1 text-sm text-slate-600">Stable water quality and normal conditions.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-sky-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Good</p>
                  <p className="mt-1 text-sm text-slate-600">Ongoing observation with minor variations.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Poor</p>
                  <p className="mt-1 text-sm text-slate-600">Elevated pollution levels need attention.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-rose-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Critical</p>
                  <p className="mt-1 text-sm text-slate-600">Critical conditions require immediate response.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Map Legend</h2>
            <p className="mt-2 text-sm text-slate-600">Use the legend to interpret water body health and status markers on the map.</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-700">Healthy - Good water quality</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-sky-500" />
                <span className="text-sm text-slate-700">Good - Stable, under observation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-700">Poor - Elevated risk or pollution</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-4 w-4 rounded-full bg-rose-500" />
                <span className="text-sm text-slate-700">Critical - Critical or unsafe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeMap
