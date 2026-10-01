'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { AlertTriangle, CheckCircle, Clock, BellRing, RefreshCw } from 'lucide-react'

export default function AlertsView({ role = 'admin' }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/alerts')
      setAlerts(res.data.alerts || [])
    } catch (error) {
      toast.error('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/acknowledge`)
      toast.success('Alert acknowledged')
      fetchAlerts()
    } catch (error) {
      toast.error('Failed to acknowledge alert')
    }
  }

  const handleResolve = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/resolve`, { resolutionNotes: 'Resolved' })
      toast.success('Alert resolved')
      fetchAlerts()
    } catch (error) {
      toast.error('Failed to resolve alert')
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case 'medium':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Quality Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated parameter threshold triggers and critical warnings</p>
        </div>
        <button
          onClick={fetchAlerts}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Alerts
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Active & Historical Alerts ({alerts.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f25c05]"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-slate-400">No active alerts found. All water bodies are within normal thresholds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  alert.resolved
                    ? 'bg-slate-50/50 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{alert.type}</span>
                    </div>
                    {alert.resolved && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Resolved
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">{alert.waterBodyName}</h4>

                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    {Array.isArray(alert.message) ? (
                      alert.message.map((msg, idx) => (
                        <p key={idx} className="leading-relaxed">• {msg}</p>
                      ))
                    ) : (
                      <p className="leading-relaxed">{alert.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp || alert.createdAt).toLocaleString()}
                  </span>

                  {!alert.resolved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcknowledge(alert._id)}
                        className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Acknowledge
                      </button>
                      {(role === 'admin' || role === 'officer') && (
                        <button
                          onClick={() => handleResolve(alert._id)}
                          className="py-1 px-3 bg-[#f25c05] hover:brightness-105 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
