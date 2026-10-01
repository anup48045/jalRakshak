'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  History,
  Sparkles,
  ExternalLink,
  LogOut,
  MapPin,
  FileText,
  AlertTriangle,
  Users,
  MessageSquare,
  Droplets,
  Activity,
  Layers,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// View Components
import WaterBodiesView from './views/WaterBodiesView'
import SurveysView from './views/SurveysView'
import NewSurveyView from './views/NewSurveyView'
import ComplaintsView from './views/ComplaintsView'
import AlertsView from './views/AlertsView'
import HealthCalculatorView from './views/HealthCalculatorView'
import RealTimeMapView from './views/RealTimeMapView'

// Existing App Components
import UserManagement from '@/components/UserManagement/page'
import ComplaintForm from '@/components/ComplaintForm/page'
import AIAnalysis from '@/components/AIAnalysis/page'
import WaterQualityForm from '@/components/WaterQualityForm/page'
import BarGraph from '@/components/BarGraph/page'
import WaterBodyList from '@/components/WaterBodyList/page'

function ReportsInnerView() {
  const [selectedWaterBodyId, setSelectedWaterBodyId] = useState(null)

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Water Quality Reports & Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Select any water body to analyze historical WQI trends and parameters</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <WaterBodyList onWaterBodySelect={setSelectedWaterBodyId} />
        </div>
        <div className="w-full lg:w-2/3">
          <BarGraph waterBodyId={selectedWaterBodyId} />
        </div>
      </div>
    </div>
  )
}

export default function DashboardShell({
  user,
  role = 'admin',
  title = 'Dashboard Overview',
  stats = [],
  chartData = [],
  recentItemsTitle = 'Recent Alerts',
  recentItems = [],
  recentItemsBadge = 'Live data',
  secondaryRecentTitle = 'Recent Citizen Complaints',
  secondaryRecentItems = [],
  secondaryRecentBadge = 'Live data',
  navItems = [],
  quickActions = [],
  bottomContent = null,
  onLogout,
  children
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Default navigation items based on role
  const defaultNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    ...(role === 'admin'
      ? [
        { id: 'water-bodies', label: 'Water Bodies', icon: Droplets },
        { id: 'surveys', label: 'Surveys', icon: FileText },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'complaints', label: 'Citizen Reports', icon: MessageSquare },
        { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
        { id: 'reports', label: 'Analytics & Reports', icon: Activity },
        { id: 'geomap', label: 'GIS Geo Map', icon: MapPin },
        { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles }
      ]
      : role === 'officer'
        ? [
          { id: 'surveys', label: 'My Surveys', icon: FileText },
          { id: 'new-survey', label: 'New Survey', icon: FileSpreadsheet },
          { id: 'water-quality-update', label: 'Update Water Quality', icon: Droplets },
          { id: 'alerts', label: 'Alerts & Warnings', icon: AlertTriangle },
          { id: 'reports', label: 'Reports', icon: Activity },
          { id: 'geomap', label: 'GIS Geo Map', icon: MapPin },
          { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles }
        ]
        : [
          { id: 'new-complaint', label: 'Report Pollution', icon: AlertTriangle },
          { id: 'complaints', label: 'My Complaints', icon: MessageSquare },
          { id: 'geomap', label: 'Water Bodies Map', icon: MapPin },
          { id: 'ai-analysis', label: 'AI Water Analysis', icon: Sparkles },
          { id: 'health-calculator', label: 'WQI Calculator', icon: Activity }
        ])
  ]

  const activeNavList = navItems.length > 0 ? navItems : defaultNavItems

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'A'
  const displayEmail = user?.email || (user?.name ? `${user.name.toLowerCase().replace(/\s+/g, '')}@jalrakshak.gov.in` : 'admin@aris.gov.in')
  const roleLabel = (user?.role || role).toUpperCase()

  // Map quick action clicks to tab changes if matching
  const handleQuickAction = (action) => {
    if (action.tabId) {
      setActiveTab(action.tabId)
    } else if (action.onClick) {
      action.onClick()
    }
  }

  // Get active page title
  const getHeaderTitle = () => {
    if (activeTab === 'overview') return title || 'Dashboard Overview'
    const currentItem = activeNavList.find(n => n.id === activeTab)
    return currentItem ? currentItem.label : 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex text-slate-800 antialiased font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Stays fixed on left */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Top Logo & App Branding */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-white shadow-md p-2">
              <div className="w-full h-full rounded-lg border border-cyan-400/40 flex items-center justify-center font-black text-xs tracking-tighter bg-slate-900 text-cyan-400">
              </div>
              {/* <Image src="/logo.png" alt="Logo" width={50} height={50} /> */}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">jalrakshak</span>
                <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  {roleLabel}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                AI-Powered Standards Database
              </span>
            </div>
          </div>

          {/* Section Divider / Label */}
          <div className="mt-8 mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              NAVIGATION
            </span>
          </div>

          {/* Nav List - Clicking changes tab without page redirect */}
          <nav className="space-y-1 mt-1">
            {activeNavList.map((item) => {
              const Icon = item.icon || LayoutDashboard
              const isItemActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isItemActive
                    ? 'bg-[#feeee5] text-[#d9480f] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isItemActive ? 'text-[#f25c05]' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isItemActive && <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/60 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Right Content Area - Always has header and displays selected view */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {getHeaderTitle()}
            </h1>
          </div>

          {/* User Status / Profile Card */}
          <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#fde8dc] text-[#d9480f] font-bold flex items-center justify-center text-xs">
              {userInitial}
            </div>
            <span className="text-xs md:text-sm font-medium text-slate-600 truncate max-w-[140px] sm:max-w-none">
              {displayEmail}
            </span>
          </div>
        </header>

        {/* Dynamic Content Viewport */}
        <main className="px-6 pb-12 flex-1">
          {/* 1. OVERVIEW TAB VIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards (4 columns) */}
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon || (i === 0 ? BookOpen : i === 1 ? Layers : i === 2 ? History : Activity)

                    const colorMap = {
                      orange: {
                        bg: 'bg-orange-50/80',
                        border: 'border-orange-100/70',
                        text: 'text-[#f25c05]',
                        iconText: 'text-[#f25c05]'
                      },
                      blue: {
                        bg: 'bg-blue-50/80',
                        border: 'border-blue-100/70',
                        text: 'text-blue-500',
                        iconText: 'text-blue-500'
                      },
                      green: {
                        bg: 'bg-emerald-50/80',
                        border: 'border-emerald-100/70',
                        text: 'text-emerald-500',
                        iconText: 'text-emerald-500'
                      },
                      purple: {
                        bg: 'bg-purple-50/80',
                        border: 'border-purple-100/70',
                        text: 'text-purple-500',
                        iconText: 'text-purple-500'
                      }
                    }

                    const assignedColor = stat.color || (i === 0 ? 'orange' : i === 1 ? 'blue' : i === 2 ? 'green' : 'purple')
                    const scheme = colorMap[assignedColor] || colorMap.orange

                    return (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Icon Badge */}
                          <div className={`w-10 h-10 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.iconText}`}>
                            <Icon className="w-5 h-5 stroke-[1.8]" />
                          </div>

                          {/* Number Display */}
                          <div className={`text-3xl font-extrabold ${scheme.text} tracking-tight mt-4`}>
                            {stat.value ?? 0}
                          </div>

                          {/* Title */}
                          <div className="text-sm font-semibold text-slate-800 mt-1">
                            {stat.label}
                          </div>
                        </div>

                        {/* Subtitle / Status */}
                        <div className="text-xs text-slate-400 font-normal mt-1">
                          {stat.subtext || (i === 0 ? `${stat.value || 0} active` : i === 1 ? 'Operational' : i === 2 ? 'Updated recently' : 'Needs attention')}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Recent Alerts */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-900 text-base tracking-tight">
                      {recentItemsTitle}
                    </h3>
                    <span className="text-xs font-semibold text-[#f25c05] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f25c05] animate-pulse" />
                      {recentItemsBadge}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {recentItems && recentItems.length > 0 ? (
                      recentItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100/90 rounded-xl p-3 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f25c05] flex items-center justify-center shrink-0 border border-orange-100/50">
                              {item.icon ? <item.icon className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {item.title || item.name}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                {item.subtitle || item.description || item.date}
                              </p>
                            </div>
                          </div>
                          {item.statusBadge && item.statusBadge}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No alerts available</p>
                    )}
                  </div>
                </div>

                {/* Column 2: Recent Citizen Complaints */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-900 text-base tracking-tight">
                      {secondaryRecentTitle || 'Recent Citizen Complaints'}
                    </h3>
                    <span className="text-xs font-semibold text-[#f25c05] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f25c05] animate-pulse" />
                      {secondaryRecentBadge || 'Live data'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {secondaryRecentItems && secondaryRecentItems.length > 0 ? (
                      secondaryRecentItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100/90 rounded-xl p-3 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f25c05] flex items-center justify-center shrink-0 border border-orange-100/50">
                              {item.icon ? <item.icon className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {item.title || item.name}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                {item.subtitle || item.description || item.date}
                              </p>
                            </div>
                          </div>
                          {item.statusBadge && item.statusBadge}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No citizen complaints recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Custom Role Content */}
              {bottomContent && (
                <div className="mt-8 space-y-6">
                  {bottomContent}
                </div>
              )}
            </div>
          )}

          {/* 2. WATER BODIES VIEW */}
          {activeTab === 'water-bodies' && (
            <WaterBodiesView />
          )}

          {/* 3. SURVEYS VIEW */}
          {activeTab === 'surveys' && (
            <SurveysView
              role={role}
              user={user}
              onNewSurvey={() => setActiveTab('new-survey')}
            />
          )}

          {/* 4. NEW SURVEY VIEW */}
          {activeTab === 'new-survey' && (
            <NewSurveyView
              onBack={() => setActiveTab('surveys')}
              onComplete={() => setActiveTab('surveys')}
            />
          )}

          {/* 5. USER MANAGEMENT VIEW */}
          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <UserManagement />
            </div>
          )}

          {/* 6. COMPLAINTS VIEW */}
          {activeTab === 'complaints' && (
            <ComplaintsView
              role={role}
              user={user}
              onNewComplaint={() => setActiveTab('new-complaint')}
            />
          )}

          {/* 7. NEW COMPLAINT VIEW */}
          {activeTab === 'new-complaint' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <ComplaintForm onComplete={() => setActiveTab('complaints')} />
            </div>
          )}

          {/* 8. ALERTS VIEW */}
          {activeTab === 'alerts' && (
            <AlertsView role={role} />
          )}

          {/* 9. REPORTS VIEW */}
          {activeTab === 'reports' && (
            <ReportsInnerView />
          )}

          {/* 10. REAL-TIME GEO MAP VIEW */}
          {activeTab === 'geomap' && (
            <RealTimeMapView />
          )}

          {/* 11. AI ANALYSIS VIEW */}
          {activeTab === 'ai-analysis' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <AIAnalysis />
            </div>
          )}

          {/* 12. HEALTH CALCULATOR VIEW */}
          {activeTab === 'health-calculator' && (
            <HealthCalculatorView />
          )}

          {/* 13. WATER QUALITY UPDATE VIEW */}
          {activeTab === 'water-quality-update' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <WaterQualityForm />
            </div>
          )}

          {/* Custom Slot */}
          {children}
        </main>
      </div>
    </div>
  )
}
