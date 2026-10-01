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
  Clock,
  MessageSquare
} from 'lucide-react'

export default function OfficerDashboard() {
  const router = useRouter()
  const { user, logout, hasRole } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [mySurveys, setMySurveys] = useState([])
  const [recentAlerts, setRecentAlerts] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])
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

      const complaintsPromise = api.get('/citizen-reports?limit=5').catch(err => {
        console.error('Complaints API error:', err)
        return { data: { reports: [] } }
      })

      const [statsRes, surveysRes, alertsRes, complaintsRes] = await Promise.all([
        statsPromise,
        surveysPromise,
        alertsPromise,
        complaintsPromise
      ])

      setStats(statsRes?.data?.stats ?? null)
      setMySurveys(surveysRes?.data?.surveys ?? [])
      setRecentAlerts(alertsRes?.data?.alerts ?? [])
      setRecentComplaints(complaintsRes?.data?.reports ?? [])
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

  const pendingComplaintsCount = recentComplaints.filter(c => c.status === 'pending' || !c.status).length

  const statCards = [
    {
      label: 'Water Bodies',
      value: stats?.totalWaterBodies ?? 275,
      subtext: `${stats?.totalWaterBodies ?? 275} monitored`,
      color: 'orange',
      icon: Droplets
    },
    {
      label: 'My Surveys',
      value: mySurveys.length > 0 ? mySurveys.length : (stats?.surveysCompleted ?? 0),
      subtext: 'Inspections logged',
      color: 'blue',
      icon: FileText
    },
    {
      label: 'Citizen Reports',
      value: stats?.citizenReports ?? recentComplaints.length,
      subtext: `${pendingComplaintsCount} pending review`,
      color: 'green',
      icon: MessageSquare
    },
    {
      label: 'Active Alerts',
      value: stats?.activeAlerts ?? 0,
      subtext: stats?.activeAlerts > 0 ? `${stats.activeAlerts} need attention` : 'Parameters normal',
      color: 'purple',
      icon: AlertTriangle
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
        icon: AlertTriangle,
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
    : []

  const recentComplaintItems = recentComplaints.length > 0
    ? recentComplaints.slice(0, 3).map((complaint) => ({
        id: complaint._id,
        title: complaint.title || 'Citizen Complaint',
        subtitle: `${complaint.locationName || complaint.location || 'Delhi'} · ${new Date(complaint.createdAt).toLocaleDateString()}`,
        icon: MessageSquare,
        statusBadge: (
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              complaint.status === 'resolved'
                ? 'bg-emerald-100 text-emerald-700'
                : complaint.status === 'in-progress'
                ? 'bg-amber-100 text-amber-700'
                : complaint.status === 'verified'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {complaint.status || 'pending'}
          </span>
        )
      }))
    : []

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
      title: 'Citizen Reports',
      description: 'View and track complaints & pollution reports from citizens',
      icon: MessageSquare,
      tabId: 'complaints'
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
    </div>
  )

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
      secondaryRecentTitle="Recent Citizen Complaints"
      secondaryRecentItems={recentComplaintItems}
      secondaryRecentBadge="Live data"
      quickActions={quickActions}
      bottomContent={bottomSection}
      onLogout={handleLogout}
    />
  )
}
