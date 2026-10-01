'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { Plus, Check, Clock, AlertTriangle, MapPin, Calendar, User } from 'lucide-react'

export default function ComplaintsView({ role = 'admin', user, onNewComplaint }) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchComplaints()
  }, [filter, role, user])

  const fetchComplaints = async () => {
    try {
      let url = '/citizen-reports'
      if (role === 'citizen' && user) {
        url += `?reporterId=${user._id || user.id}`
      } else if (filter !== 'all') {
        url += `?status=${filter}`
      }

      const res = await api.get(url)
      setComplaints(res.data.reports || [])
    } catch (error) {
      toast.error('Failed to fetch complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/citizen-reports/${complaintId}/verify`, { status: newStatus })
      toast.success(`Complaint status marked as ${newStatus}`)
      fetchComplaints()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'verified':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {role === 'citizen' ? 'My Submitted Complaints' : 'Citizen Reports & Complaints'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and verify pollution reports submitted by citizens
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === 'admin' && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}
          {onNewComplaint && (
            <button
              onClick={onNewComplaint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f25c05] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Report Pollution
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Complaints Records ({complaints.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f25c05]"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No complaints found</p>
            {onNewComplaint && (
              <button
                onClick={onNewComplaint}
                className="px-4 py-2 bg-[#f25c05] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all shadow-sm"
              >
                Submit A Report
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="p-4 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-100/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-800">
                      {complaint.title || 'Untitled Complaint'}
                    </h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                      {complaint.status || 'pending'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {complaint.description}
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{complaint.locationName || complaint.location || 'Delhi'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Reporter: {complaint.isAnonymous ? 'Anonymous' : complaint.reporterName || 'Citizen'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {complaint.images && (
                    <div className="mt-3">
                      <img
                        src={complaint.images}
                        alt="Evidence"
                        className="h-28 w-full object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {role === 'admin' && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200/60">
                    {complaint.status !== 'verified' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint._id, 'verified')}
                        className="flex-1 py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
                      >
                        Verify
                      </button>
                    )}
                    {complaint.status !== 'in-progress' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint._id, 'in-progress')}
                        className="flex-1 py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200 transition-colors"
                      >
                        In Progress
                      </button>
                    )}
                    {complaint.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(complaint._id, 'resolved')}
                        className="flex-1 py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
