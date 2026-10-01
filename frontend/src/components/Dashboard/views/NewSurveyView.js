'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewSurveyView({ onBack, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [waterBodies, setWaterBodies] = useState([])
  const [includeWaterQuality, setIncludeWaterQuality] = useState(false)
  const [formData, setFormData] = useState({
    waterBodyId: '',
    waterLevel: 'medium',
    waterQuality: 'good',
    pollutionObserved: false,
    pollutionType: [],
    encroachmentObserved: false,
    encroachmentDetails: '',
    vegetation: 'sparse',
    remarks: '',
    waterQualityData: {
      temp: '',
      do: '',
      ph: '',
      conductivity: '',
      bod: '',
      nitrate: '',
      fecalColiform: '',
      totalColiform: ''
    }
  })

  useEffect(() => {
    fetchWaterBodies()
  }, [])

  const fetchWaterBodies = async () => {
    try {
      const res = await api.get('/waterbodies')
      setWaterBodies(res.data.waterBodies || [])
    } catch (error) {
      toast.error('Failed to fetch water bodies')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        pollutionType: formData.pollutionType.filter((p) => p)
      }

      if (includeWaterQuality) {
        payload.waterQualityData = {
          temp: parseFloat(formData.waterQualityData.temp),
          do: parseFloat(formData.waterQualityData.do),
          ph: parseFloat(formData.waterQualityData.ph),
          conductivity: parseFloat(formData.waterQualityData.conductivity),
          bod: parseFloat(formData.waterQualityData.bod),
          nitrate: parseFloat(formData.waterQualityData.nitrate),
          fecalColiform: parseFloat(formData.waterQualityData.fecalColiform),
          totalColiform: parseFloat(formData.waterQualityData.totalColiform)
        }
      } else {
        delete payload.waterQualityData
      }

      await api.post('/surveys', payload)
      toast.success('Survey recorded successfully')
      if (onComplete) {
        onComplete()
      } else if (onBack) {
        onBack()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create survey')
    } finally {
      setLoading(false)
    }
  }

  const handlePollutionTypeChange = (type) => {
    setFormData((prev) => {
      const currentTypes = prev.pollutionType || []
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          pollutionType: currentTypes.filter((t) => t !== type)
        }
      } else {
        return {
          ...prev,
          pollutionType: [...currentTypes, type]
        }
      }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Conduct New Survey</h2>
            <p className="text-xs text-slate-500 mt-0.5">Record on-ground survey measurements & observations</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Water Body *</label>
            <select
              required
              value={formData.waterBodyId}
              onChange={(e) => setFormData({ ...formData, waterBodyId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            >
              <option value="">Select a water body</option>
              {waterBodies.map((wb) => (
                <option key={wb._id} value={wb._id}>
                  {wb.name} - {wb.district}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Water Level *</label>
              <select
                required
                value={formData.waterLevel}
                onChange={(e) => setFormData({ ...formData, waterLevel: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="dry">Dry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Visual Quality *</label>
              <select
                required
                value={formData.waterQuality}
                onChange={(e) => setFormData({ ...formData, waterQuality: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vegetation</label>
              <select
                value={formData.vegetation}
                onChange={(e) => setFormData({ ...formData, vegetation: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
              >
                <option value="dense">Dense</option>
                <option value="moderate">Moderate</option>
                <option value="sparse">Sparse</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pollution & Encroachment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Field Assessment</h3>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pollutionObserved"
              checked={formData.pollutionObserved}
              onChange={(e) => setFormData({ ...formData, pollutionObserved: e.target.checked })}
              className="w-4 h-4 text-[#f25c05] rounded focus:ring-[#f25c05]"
            />
            <label htmlFor="pollutionObserved" className="text-xs font-semibold text-slate-700">
              Pollution Observed at Site
            </label>
          </div>

          {formData.pollutionObserved && (
            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Pollution Types:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Industrial Waste',
                  'Sewage',
                  'Agricultural Runoff',
                  'Plastic Waste',
                  'Oil Spill',
                  'Chemical Contamination',
                  'Thermal Pollution',
                  'Other'
                ].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.pollutionType.includes(type)}
                      onChange={() => handlePollutionTypeChange(type)}
                      className="w-3.5 h-3.5 text-[#f25c05] rounded"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="encroachmentObserved"
                checked={formData.encroachmentObserved}
                onChange={(e) => setFormData({ ...formData, encroachmentObserved: e.target.checked })}
                className="w-4 h-4 text-[#f25c05] rounded focus:ring-[#f25c05]"
              />
              <label htmlFor="encroachmentObserved" className="text-xs font-semibold text-slate-700">
                Encroachment Observed Around Buffer Zone
              </label>
            </div>

            {formData.encroachmentObserved && (
              <div className="mt-3">
                <textarea
                  value={formData.encroachmentDetails}
                  onChange={(e) => setFormData({ ...formData, encroachmentDetails: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                  placeholder="Describe encroachment details..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Optional Water Quality Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <input
              type="checkbox"
              id="includeWaterQuality"
              checked={includeWaterQuality}
              onChange={(e) => setIncludeWaterQuality(e.target.checked)}
              className="w-4 h-4 text-[#f25c05] rounded focus:ring-[#f25c05]"
            />
            <label htmlFor="includeWaterQuality" className="text-sm font-bold text-slate-900 cursor-pointer">
              Include Sensor / Lab Parameters for AI WQI Scoring
            </label>
          </div>

          {includeWaterQuality && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Temp (°C) *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.temp}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, temp: e.target.value } })}
                  placeholder="25.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DO (mg/L) *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.do}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, do: e.target.value } })}
                  placeholder="6.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">pH Level *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.ph}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, ph: e.target.value } })}
                  placeholder="7.2"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conductivity *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.conductivity}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, conductivity: e.target.value } })}
                  placeholder="500"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">BOD (mg/L) *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.bod}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, bod: e.target.value } })}
                  placeholder="3.2"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nitrate (mg/L) *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.nitrate}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, nitrate: e.target.value } })}
                  placeholder="10.5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fecal Coliform *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.fecalColiform}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, fecalColiform: e.target.value } })}
                  placeholder="50"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Coliform *</label>
                <input
                  type="number"
                  step="0.1"
                  required={includeWaterQuality}
                  value={formData.waterQualityData.totalColiform}
                  onChange={(e) => setFormData({ ...formData, waterQualityData: { ...formData.waterQualityData, totalColiform: e.target.value } })}
                  placeholder="100"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Additional Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f25c05]/20 focus:border-[#f25c05]"
            placeholder="Field observations or notes..."
          />
        </div>

        <div className="flex gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 px-5 bg-[#f25c05] hover:brightness-105 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            {loading ? 'Submitting Survey...' : 'Submit Survey Record'}
          </button>
        </div>
      </form>
    </div>
  )
}
