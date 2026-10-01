'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, MapPin, Tag, Maximize2, Activity } from 'lucide-react'

export default function WaterBodiesView() {
  const [waterBodies, setWaterBodies] = useState([])
  const [qualityData, setQualityData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingWaterBody, setEditingWaterBody] = useState(null)
  const [filter, setFilter] = useState({ district: '', category: '', status: '' })

  useEffect(() => {
    fetchWaterBodies()
  }, [filter.district, filter.category])

  const fetchWaterBodies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.district) params.append('district', filter.district)
      if (filter.category) params.append('category', filter.category)

      const [wbRes, wqRes] = await Promise.allSettled([
        api.get(`/waterbodies?${params.toString()}`),
        api.get('/waterquality')
      ])

      if (wbRes.status === 'fulfilled') {
        setWaterBodies(wbRes.value.data.waterBodies || [])
      }
      if (wqRes.status === 'fulfilled') {
        setQualityData(wqRes.value.data.records || [])
      }
    } catch (error) {
      toast.error('Failed to fetch water bodies')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentQuality = (waterBodyId) => {
    const currentYear = new Date().getFullYear()

    if (!qualityData?.length) return null

    const currentQuality = qualityData.find(
      (q) =>
        Number(q.year) === currentYear &&
        String(q.waterBodyId?._id || q.waterBodyId) === String(waterBodyId)
    )

    if (currentQuality) return currentQuality

    return (
      qualityData
        .filter(
          (q) => String(q.waterBodyId?._id || q.waterBodyId) === String(waterBodyId)
        )
        .sort((a, b) => Number(b.year) - Number(a.year))[0] || null
    )
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this water body?')) return

    try {
      await api.delete(`/waterbodies/${id}`)
      toast.success('Water body deleted successfully')
      fetchWaterBodies()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete water body')
    }
  }

  const handleEdit = (waterBody) => {
    setEditingWaterBody(waterBody)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingWaterBody(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingWaterBody(null)
    fetchWaterBodies()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
      case 'healthy':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'good':
        return 'bg-lime-100 text-lime-800 border border-lime-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'poor':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const filteredWaterBodies = waterBodies.filter((wb) => {
    if (!filter.status) return true
    const quality = getCurrentQuality(wb._id)
    const currentStatus = (quality?.status || wb.status || '').toLowerCase()
    return currentStatus === filter.status.toLowerCase()
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Water Bodies Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage, filter, and inspect registered water bodies across Delhi</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#f25c05] text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Water Body
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Filter Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
            <select
              value={filter.district}
              onChange={(e) => setFilter({ ...filter, district: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="">All Districts</option>
              <option value="North Delhi">North Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="West Delhi">West Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="North East Delhi">North East Delhi</option>
              <option value="North West Delhi">North West Delhi</option>
              <option value="South West Delhi">South West Delhi</option>
              <option value="Shahdara">Shahdara</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="">All Categories</option>
              <option value="lake">Lake</option>
              <option value="pond">Pond</option>
              <option value="wetland">Wetland</option>
              <option value="reservoir">Reservoir</option>
              <option value="river">River</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Health Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="">All Statuses</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="healthy">Healthy</option>
              <option value="moderate">Moderate</option>
              <option value="poor">Poor</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Water Bodies List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Registered Water Bodies ({filteredWaterBodies.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f25c05]"></div>
          </div>
        ) : filteredWaterBodies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-slate-400">No water bodies match the selected filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredWaterBodies.map((waterBody) => {
              const quality = getCurrentQuality(waterBody._id)
              const healthStatus = quality?.status || waterBody.status || 'No Data'
              const healthScore = quality?.healthScore ?? waterBody.healthScore ?? 'N/A'

              return (
                <div
                  key={waterBody._id}
                  className="p-4 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl border border-slate-100/90 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-bold text-sm text-slate-800 truncate">{waterBody.name}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(healthStatus)}`}>
                        {healthStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{waterBody.description || 'No description provided'}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{waterBody.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="capitalize truncate">{waterBody.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{waterBody.area} sqm</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Activity className="w-3.5 h-3.5 text-[#f25c05] shrink-0" />
                        <span className="font-semibold text-slate-800">Score: {healthScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200/60">
                    <button
                      onClick={() => handleEdit(waterBody)}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(waterBody._id)}
                      className="py-1.5 px-3 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-100">
            <WaterBodyFormModal waterBody={editingWaterBody} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  )
}

function WaterBodyFormModal({ waterBody, onClose }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: waterBody?.name || '',
    district: waterBody?.district || '',
    area: waterBody?.area || '',
    category: waterBody?.category || 'lake',
    healthScore: waterBody?.healthScore || 50,
    description: waterBody?.description || '',
    location: {
      type: 'Point',
      coordinates: waterBody?.location?.coordinates || [77.209, 28.6139]
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        area: Number(formData.area),
        healthScore: Number(formData.healthScore)
      }

      if (waterBody) {
        await api.put(`/waterbodies/${waterBody._id}`, payload)
        toast.success('Water body updated successfully')
      } else {
        await api.post('/waterbodies', payload)
        toast.success('Water body created successfully')
      }
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save water body')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
        <h3 className="text-lg font-bold text-slate-900">
          {waterBody ? 'Edit Water Body' : 'Add New Water Body'}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name of the water body"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
            <select
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="">Select District</option>
              <option value="North Delhi">North Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="West Delhi">West Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="North East Delhi">North East Delhi</option>
              <option value="North West Delhi">North West Delhi</option>
              <option value="South West Delhi">South West Delhi</option>
              <option value="Shahdara">Shahdara</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="lake">Lake</option>
              <option value="pond">Pond</option>
              <option value="wetland">Wetland</option>
              <option value="reservoir">Reservoir</option>
              <option value="river">River</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sqm) *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="Area in square meters"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Health Score (0-100) *</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={formData.healthScore}
              onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
              placeholder="Health score (0-100)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description of the water body"
            rows={3}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude *</label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.coordinates[0]}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [parseFloat(e.target.value) || 0, formData.location.coordinates[1]]
                }
              })}
              placeholder="Longitude"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude *</label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.coordinates[1]}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [formData.location.coordinates[0], parseFloat(e.target.value) || 0]
                }
              })}
              placeholder="Latitude"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-[#f25c05] hover:brightness-105 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            {loading ? 'Saving...' : waterBody ? 'Update Water Body' : 'Create Water Body'}
          </button>
        </div>
      </form>
    </div>
  )
}
