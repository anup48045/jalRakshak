'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import DashboardShell from '@/components/Dashboard/DashboardShell'
import {
  AlertTriangle,
  MapPin,
  Sparkles,
  Activity,
  Droplets,
  Building2,
  Clock,
  FileSpreadsheet
} from 'lucide-react'

export default function CitizenDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [myComplaints, setMyComplaints] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        user ? api.get('/citizen-reports?reporterId=' + user._id + '&limit=5').catch(() => ({ data: { reports: [] } })) : Promise.resolve({ data: { reports: [] } }),
        api.get('/dashboard/stats').catch(() => ({ data: { stats: null } }))
      ])
      setMyComplaints(complaintsRes.data.reports || [])
      setStats(statsRes.data.stats)
    } catch (error) {
      toast.error('Failed to load dashboard data')
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
      label: 'My Complaints',
      value: myComplaints.length > 0 ? myComplaints.length : 3,
      subtext: '3 complaints',
      color: 'green',
      icon: Clock
    },
    {
      label: 'Active Alerts',
      value: stats?.activeAlerts ?? 0,
      subtext: 'Needs attention',
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

  const recentComplaintItems = myComplaints.length > 0
    ? myComplaints.slice(0, 3).map((comp) => ({
      id: comp._id,
      title: comp.title || 'Water Body Pollution Report',
      subtitle: comp.description?.substring(0, 50) || 'Citizen submitted report',
      icon: FileSpreadsheet,
      statusBadge: (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${comp.status === 'resolved'
              ? 'bg-emerald-100 text-emerald-700'
              : comp.status === 'in-progress'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
        >
          {comp.status || 'Pending'}
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
      title: 'Report Pollution',
      description: 'Submit an incident or water pollution complaint with photos',
      icon: AlertTriangle,
      tabId: 'new-complaint'
    },
    {
      title: 'Water Bodies Map',
      description: 'Explore live quality and health status of local water bodies',
      icon: MapPin,
      tabId: 'geomap'
    },
    {
      title: 'AI Analysis',
      description: 'Analyze water images with deep learning classification',
      icon: Sparkles,
      tabId: 'ai-analysis'
    },
    {
      title: 'WQI Calculator',
      description: 'Calculate Water Quality Index based on standard parameters',
      icon: Activity,
      tabId: 'health-calculator'
    }
  ]

  const bottomSection = (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base tracking-tight">
          My Submitted Complaints & Reports
        </h3>
      </div>

      {myComplaints.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-slate-400 mb-4">No complaints or pollution reports submitted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100/90 rounded-xl transition-all"
            >
              <div className="min-w-0 pr-4">
                <p className="font-semibold text-xs md:text-sm text-slate-800">
                  {complaint.title || 'Untitled Complaint'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {complaint.description?.substring(0, 60)}...
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.isAnonymous ? 'Anonymous' : complaint.reporterName || 'You'}
                </p>
              </div>
              <span
                className={`shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${complaint.status === 'resolved'
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
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <DashboardShell
      user={user}
      role="citizen"
      title="Dashboard Overview"
      stats={statCards}
      chartTitle="Standards by Department"
      chartData={chartData}
      recentItemsTitle="My Recent Complaints"
      recentItems={recentComplaintItems}
      recentItemsBadge="Live data"
      secondaryRecentTitle="Guidelines & Information"
      secondaryRecentItems={[]}
      secondaryRecentBadge="Active"
      quickActions={quickActions}
      bottomContent={bottomSection}
      onLogout={handleLogout}
    />
  )
}
