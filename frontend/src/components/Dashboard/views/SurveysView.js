'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { Plus, Eye, Calendar, User, CheckCircle2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SurveysView({ role = 'admin', user, onNewSurvey }) {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSurvey, setSelectedSurvey] = useState(null)

  useEffect(() => {
    fetchSurveys()
  }, [role, user])

  const fetchSurveys = async () => {
    try {
      if (role === 'admin') {
        const res = await api.get('/surveys')
        setSurveys(res.data.surveys || [])
      } else {
        const res = await api.get(`/surveys?officerId=${user?.id || user?._id}`)
        setSurveys(res.data.surveys || [])
      }
    } catch (error) {
      toast.error('Failed to fetch surveys')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-100 text-emerald-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'poor':
      case 'fair':
        return 'bg-amber-100 text-amber-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {role === 'officer' ? 'My Recorded Surveys' : 'Field Inspection Surveys'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time survey reports and sensor data collected across Delhi water bodies
          </p>
        </div>
        <button
          onClick={onNewSurvey}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#f25c05] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Survey
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            All Surveys ({surveys.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f25c05]"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No field surveys found</p>
            <button
              onClick={onNewSurvey}
              className="px-4 py-2 bg-[#f25c05] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all shadow-sm"
            >
              Create Your First Survey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="p-4 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-100/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-800 truncate">
                      {survey.waterBodyId?.name || 'Water Body'}
                    </h4>
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                      {survey.waterBodyId?.district || ''}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 text-xs bg-white p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Water Level:</span>
                      <span className="font-semibold text-slate-800 capitalize">{survey.waterLevel}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Visual Quality:</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${getStatusColor(survey.waterQuality)}`}>
                        {survey.waterQuality}
                      </span>
                    </div>

                    {survey.wqiResults && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">WQI:</span>
                          <span className="font-bold text-slate-900">{survey.wqiResults.wqi?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Health Score:</span>
                          <span className="font-bold text-[#f25c05]">{survey.wqiResults.healthScore?.toFixed(1)}</span>
                        </div>
                      </div>
                    )}

                    {survey.pollutionObserved && (
                      <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-semibold pt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Pollution Observed
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{survey.officerName || 'Survey Officer'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(survey.createdAt).toISOString().split('T')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
