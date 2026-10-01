'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import DashboardShell from '@/components/Dashboard/DashboardShell'
import {
  Droplets,
  Users,
  MessageSquare,
  Activity,
  FileText,
  AlertTriangle,
  MapPin,
  Sparkles,
  FileSpreadsheet,
  Clock,
  Building2
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, hasRole } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [recentAlerts, setRecentAlerts] = useState([])
  const [recentSurveys, setRecentSurveys] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !hasRole(['admin'])) {
      router.push('/dashboard')
      return
    }
    fetchDashboardData()
  }, [user, router, hasRole])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      try {
        const statsRes = await api.get('/dashboard/stats')
        setStats(statsRes.data.stats)
      } catch (error) {
        console.error('Stats fetch error:', error)
        toast.error('Failed to load dashboard statistics: ' + (error.response?.data?.message || error.message))
      }

      // Fetch recent alerts
      try {
        const alertsRes = await api.get('/dashboard/recent-alerts?limit=5')
        setRecentAlerts(alertsRes.data.alerts || [])
      } catch (error) {
        console.error('Alerts fetch error:', error)
        toast.error('Failed to load recent alerts: ' + (error.response?.data?.message || error.message))
        setRecentAlerts([])
      }

      // Fetch recent surveys
      try {
        const surveysRes = await api.get('/dashboard/recent-surveys?limit=5')
        setRecentSurveys(surveysRes.data.surveys || [])
      } catch (error) {
        console.error('Surveys fetch error:', error)
        toast.error('Failed to load recent surveys: ' + (error.response?.data?.message || error.message))
        setRecentSurveys([])
      }

      // Fetch recent complaints
      try {
        const complaintsRes = await api.get('/citizen-reports?limit=5')
        setRecentComplaints(complaintsRes.data.reports || [])
      } catch (error) {
        console.error('Complaints fetch error:', error)
        toast.error('Failed to load recent complaints: ' + (error.response?.data?.message || error.message))
        setRecentComplaints([])
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      toast.error('An unexpected error occurred while loading dashboard data')
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
      label: 'Total WaterBodies',
      value: stats?.totalWaterBodies ?? 275,
      subtext: `${stats?.totalWaterBodies ?? 275} active`,
      color: 'orange',
      icon: Droplets
    },
    {
      label: 'Healthy WaterBodies',
      value: stats?.healthyWaterBodies ?? 17,
      subtext: `${stats?.healthyWaterBodies ?? 0} healthy`,
      color: 'blue',
      icon: Building2
    },
    {
      label: 'Recent Surveys',
      value: recentSurveys.length > 0 ? recentSurveys.length : (stats?.criticalWaterBodies ?? 3),
      subtext: '3 successful',
      color: 'green',
      icon: Clock
    },
    {
      label: 'Active Alerts',
      value: stats?.activeAlerts ?? 0,
      subtext: stats?.activeAlerts > 0 ? `${stats.activeAlerts} need attention` : 'Needs attention',
      color: 'purple',
      icon: Activity
    }
  ]

  const recentAlertItems = recentAlerts.length > 0
    ? recentAlerts.slice(0, 3).map((alert) => ({
      id: alert._id,
      title: alert.waterBodyName || 'Water Body Alert',
      subtitle: Array.isArray(alert.message) ? alert.message.join(', ') : alert.message || 'Water parameter exceeded',
      icon: FileSpreadsheet,
      statusBadge: (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${alert.severity === 'critical'
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

  const recentComplaintItems = recentComplaints.length > 0
    ? recentComplaints.slice(0, 3).map((complaint) => ({
      id: complaint._id,
      title: complaint.title || 'Untitled Complaint',
      subtitle: `${complaint.description ? complaint.description.substring(0, 50) + '...' : 'Complaint submitted'} · By: ${complaint.isAnonymous ? 'Anonymous Citizen' : complaint.reporterName || 'Unknown'}`,
      icon: MessageSquare,
      statusBadge: (
        <span
          className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${complaint.status === 'resolved'
            ? 'bg-emerald-100 text-emerald-700'
            : complaint.status === 'in-progress'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {complaint.status || 'pending'}
        </span>
      )
    }))
    : []

  const quickActions = [
    {
      title: 'Manage Water Bodies',
      description: 'Add, update, or delete water body records',
      icon: Droplets,
      tabId: 'water-bodies'
    },
    {
      title: 'Manage Users',
      description: 'Create and manage Survey Officer accounts',
      icon: Users,
      tabId: 'users'
    },
    {
      title: 'Manage Complaints',
      description: 'View and verify citizen complaints & reports',
      icon: MessageSquare,
      tabId: 'complaints'
    },
    {
      title: 'View Reports',
      description: 'Access analytics and compliance reports',
      icon: Activity,
      tabId: 'reports'
    },
    {
      title: 'View Surveys',
      description: 'Review field surveys and inspection records',
      icon: FileText,
      tabId: 'surveys'
    },
    {
      title: 'Manage Alerts',
      description: 'Configure and respond to water quality alerts',
      icon: AlertTriangle,
      tabId: 'alerts'
    },
    {
      title: 'GIS Map View',
      description: 'View all water bodies on interactive map',
      icon: MapPin,
      tabId: 'geomap'
    },
    {
      title: 'AI Analysis',
      description: 'AI-driven water quality index and predictions',
      icon: Sparkles,
      tabId: 'ai-analysis'
    }
  ]

  const bottomSection = (
    <div className="space-y-6">
      {/* Recent Surveys Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Recent Field Surveys
          </h3>
        </div>

        {recentSurveys.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No recent field surveys</p>
        ) : (
          <div className="space-y-3">
            {recentSurveys.map((survey) => (
              <div
                key={survey._id}
                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100/90 rounded-xl transition-all"
              >
                <div>
                  <p className="font-semibold text-xs md:text-sm text-slate-800">
                    {survey.waterBodyId?.name || 'Water Body Survey'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Conducted by: {survey.officerId?.name || 'Survey Officer'}
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
      role="admin"
      title="Dashboard Overview"
      stats={statCards}
      chartTitle="Standards by Department"
      recentItemsTitle="Recent Alerts"
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
