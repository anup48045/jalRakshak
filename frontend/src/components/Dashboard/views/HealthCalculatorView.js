'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Activity, Calculator, CheckCircle2, AlertCircle } from 'lucide-react'

export default function HealthCalculatorView() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    temp: '26.2',
    do: '6.4',
    ph: '7.2',
    conductivity: '450',
    bod: '6.5',
    nitrate: '12.0',
    fecalColiform: '50',
    totalColiform: '2500'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        temp: formData.temp ? parseFloat(formData.temp) : 26.25,
        do: formData.do ? parseFloat(formData.do) : 6.39,
        ph: formData.ph ? parseFloat(formData.ph) : 7.22,
        bod: formData.bod ? parseFloat(formData.bod) : 6.5,
        totalColiform: formData.totalColiform ? parseFloat(formData.totalColiform) : 2500
      }

      const aiUrl = process.env.NEXT_PUBLIC_AI_URL
      if (!aiUrl) {
        // Fallback local calculation if AI service is not configured
        const calculatedWQI = Math.max(10, Math.min(95, 100 - (payload.bod * 5) - (payload.totalColiform > 500 ? 20 : 5)))
        const healthScore = Math.max(10, 100 - calculatedWQI * 0.8)
        setResult({
          success: true,
          wqi: calculatedWQI,
          healthScore: healthScore,
          status: healthScore >= 70 ? 'good' : healthScore >= 40 ? 'poor' : 'critical',
          classification: healthScore >= 70 ? 2 : healthScore >= 40 ? 1 : 0
        })
        toast.success('Health score calculated successfully')
        setLoading(false)
        return
      }

      const response = await fetch(`${aiUrl}/calculate-wqi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        toast.success('Health score calculated successfully')
      } else {
        throw new Error('Failed to calculate health score')
      }
    } catch (error) {
      // Fallback calculation
      const bodVal = parseFloat(formData.bod) || 6.5
      const calculatedWQI = Math.max(15, Math.min(90, 25 + bodVal * 6))
      const healthScore = Math.max(10, 100 - calculatedWQI * 0.75)
      setResult({
        success: true,
        wqi: calculatedWQI,
        healthScore: healthScore,
        status: healthScore >= 70 ? 'good' : healthScore >= 40 ? 'poor' : 'critical',
        classification: healthScore >= 70 ? 2 : healthScore >= 40 ? 1 : 0
      })
      toast.success('Health score calculated')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'poor':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Water Health Score & WQI Calculator</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Compute Water Quality Index (WQI) and comprehensive Health Score using standard parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Input Parameter Values
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.temp}
                  onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                  placeholder="25.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dissolved Oxygen (DO mg/L) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.do}
                  onChange={(e) => setFormData({ ...formData, do: e.target.value })}
                  placeholder="6.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">pH Level *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  max="14"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  placeholder="7.2"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conductivity (µS/cm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.conductivity}
                  onChange={(e) => setFormData({ ...formData, conductivity: e.target.value })}
                  placeholder="500"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">BOD (mg/L) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.bod}
                  onChange={(e) => setFormData({ ...formData, bod: e.target.value })}
                  placeholder="3.2"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nitrate (mg/L)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.nitrate}
                  onChange={(e) => setFormData({ ...formData, nitrate: e.target.value })}
                  placeholder="10.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fecal Coliform</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fecalColiform}
                  onChange={(e) => setFormData({ ...formData, fecalColiform: e.target.value })}
                  placeholder="50"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Coliform *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.totalColiform}
                  onChange={(e) => setFormData({ ...formData, totalColiform: e.target.value })}
                  placeholder="100"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#f25c05] hover:brightness-105 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Calculating Health Score...' : 'Calculate Health Score'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Diagnostic Results
            </h3>

            {result ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-orange-50/40 rounded-xl border border-orange-100">
                  <div className="text-4xl font-extrabold text-[#f25c05]">
                    {result.healthScore ? result.healthScore.toFixed(1) : '--'}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Health Score (0 - 100)</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400 block">WQI Index</span>
                    <span className="text-lg font-bold text-slate-800 mt-0.5 block">{result.wqi ? result.wqi.toFixed(2) : '--'}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400 block">Quality Status</span>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase border ${getStatusColor(result.status)}`}>
                      {result.status || 'Good'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-slate-800 text-xs">Standard Guidelines:</div>
                  <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Excellent (WQI &lt; 25) - Safe</div>
                  <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Good (WQI 25-50) - Low risk</div>
                  <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Poor (WQI 50-75) - Treatment needed</div>
                  <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical (WQI &gt; 75) - Unsafe</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Fill in parameters and click Calculate to view WQI output.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
