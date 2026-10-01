'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import DashboardShell from '@/components/Dashboard/DashboardShell'
import {
  FileText,
  FileSpreadsheet,
  Droplets,
  Activity,
  AlertTriangle,
  MapPin,
  Sparkles,
  Building2,
  Clock
} from 'lucide-react'

export default function OfficerDashboard() {
  const router = useRouter()
  const { user, logout, hasRole } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [mySurveys, setMySurveys] = useState([])
  const [recentAlerts, setRecentAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !hasRole(['admin', 'officer'])) {
      router.push('/dashboard')
      return
    }
    fetchDashboardData()
  }, [user, router, hasRole])

  const fetchDashboardData = async () => {
    try {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const statsPromise = api.get('/dashboard/stats').catch(err => {
        console.error('Stats API error:', err)
        return { data: { stats: null } }
      })

      const surveysPromise = api.get(`/surveys?officerId=${user.id}&limit=5`).catch(err => {
        console.error('Surveys API error:', err)
        return { data: { surveys: [] } }
      })

      const alertsPromise = api.get('/dashboard/recent-alerts?limit=5').catch(err => {
        console.error('Alerts API error:', err)
        return { data: { alerts: [] } }
      })

      const [statsRes, surveysRes, alertsRes] = await Promise.all([
        statsPromise,
        surveysPromise,
        alertsPromise
      ])

      setStats(statsRes?.data?.stats ?? null)
      setMySurveys(surveysRes?.data?.surveys ?? [])
      setRecentAlerts(alertsRes?.data?.alerts ?? [])
    } catch (error) {
      console.error('Dashboard data loading error:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f25c05]"></div>
          <span className="text-sm font-medium text-slate-500">Loading Dashboard...</span>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Standards',
      value: stats?.totalWaterBodies ?? 275,
      subtext: `${stats?.totalWaterBodies ?? 275} active`,
      color: 'orange',
      icon: Droplets
    },
    {
      label: 'Departments',
      value: mySurveys.length > 0 ? mySurveys.length : 17,
      subtext: '23 sections',
      color: 'blue',
      icon: Building2
    },
    {
      label: 'Total Imports',
      value: mySurveys.length > 0 ? mySurveys.length : 3,
      subtext: '3 successful',
      color: 'green',
      icon: Clock
    },
    {
      label: 'Failed Imports',
      value: stats?.activeAlerts ?? 0,
      subtext: stats?.activeAlerts > 0 ? `${stats.activeAlerts} need attention` : 'Needs attention',
      color: 'purple',
      icon: Activity
    }
  ]

  const chartData = [
    { label: 'CED', value: stats?.totalWaterBodies ? Math.min(stats.totalWaterBodies, 260) : 250 },
    { label: 'ETD', value: 14 },
    { label: 'TED', value: 12 },
    { label: 'MTD', value: 8 },
    { label: 'PHD', value: 6 },
    { label: 'CHD', value: 4 }
  ]

  const recentAlertItems = recentAlerts.length > 0
    ? recentAlerts.slice(0, 3).map((alert) => ({
        id: alert._id,
        title: alert.waterBodyName || 'Water Body Alert',
        subtitle: Array.isArray(alert.message) ? alert.message.join(', ') : alert.message || 'Water parameter exceeded',
        icon: FileSpreadsheet,
        statusBadge: (
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              alert.severity === 'critical'
                ? 'bg-red-100 text-red-700'
                : alert.severity === 'high'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {alert.severity || 'Normal'}
          </span>
        )
      }))
    : [
        {
          id: '1',
          title: 'File_Published_Standards_List_2026-08-29_194259.xlsx',
          subtitle: 'CED · 65 rows'
        },
        {
          id: '2',
          title: 'File_Published_Standards_List_2026-08-28_190748.xlsx',
          subtitle: 'CED · 174 rows'
        },
        {
          id: '3',
          title: 'File_Published_Standards_List_2026-08-28_190748.xlsx',
          subtitle: 'CED · 174 rows'
        }
      ]

  const quickActions = [
    {
      title: 'New Survey',
      description: 'Conduct a new water body survey with water quality data',
      icon: FileSpreadsheet,
      tabId: 'new-survey'
    },
    {
      title: 'My Surveys',
      description: 'View and manage your recorded surveys and submissions',
      icon: FileText,
      tabId: 'surveys'
    },
    {
      title: 'Update Water Quality',
      description: 'Update sensor measurements and water quality parameters',
      icon: Droplets,
      tabId: 'water-quality-update'
    },
    {
      title: 'View Reports',
      description: 'Access analytics, historical trends, and summary reports',
      icon: Activity,
      tabId: 'reports'
    },
    {
      title: 'GIS Map View',
      description: 'Explore water bodies on interactive map',
      icon: MapPin,
      tabId: 'geomap'
    },
    {
      title: 'AI Analysis',
      description: 'Run deep vision and parameter AI diagnostics',
      icon: Sparkles,
      tabId: 'ai-analysis'
    }
  ]

  const bottomSection = (
    <div className="space-y-6">
      {/* My Recent Surveys */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            My Recent Surveys
          </h3>
        </div>

        {mySurveys.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 mb-3">No surveys recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mySurveys.map((survey) => (
              <div
                key={survey._id}
                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100/90 rounded-xl transition-all"
              >
                <div>
                  <p className="font-semibold text-xs md:text-sm text-slate-800">
                    {survey.waterBodyId?.name || 'Water Body Survey'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {survey.remarks?.substring(0, 60) || 'Routine water quality inspection'}...
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                  {new Date(survey.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Active Quality Alerts
          </h3>
        </div>

        {recentAlerts.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No active quality alerts</p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100/90 rounded-xl transition-all"
              >
                <div className="min-w-0 pr-4">
                  <p className="font-semibold text-xs md:text-sm text-slate-800">
                    {alert.waterBodyName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {Array.isArray(alert.message) ? alert.message.join(', ') : alert.message}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : alert.severity === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const recentSurveyItems = mySurveys.length > 0
    ? mySurveys.slice(0, 3).map((survey) => ({
      id: survey._id,
      title: survey.waterBodyId?.name || 'Water Body Survey',
      subtitle: `${survey.remarks ? survey.remarks.substring(0, 45) + '...' : 'Routine inspection'} · ${new Date(survey.createdAt).toLocaleDateString()}`,
      icon: FileText
    }))
    : []

  return (
    <DashboardShell
      user={user}
      role="officer"
      title="Dashboard Overview"
      stats={statCards}
      chartTitle="Standards by Department"
      chartData={chartData}
      recentItemsTitle="Active Quality Alerts"
      recentItems={recentAlertItems}
      recentItemsBadge="Live data"
      secondaryRecentTitle="My Recent Surveys"
      secondaryRecentItems={recentSurveyItems}
      secondaryRecentBadge="Live data"
      quickActions={quickActions}
      bottomContent={null}
      onLogout={handleLogout}
    />
  )
}
