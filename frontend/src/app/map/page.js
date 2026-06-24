'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function MapPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [waterBodies, setWaterBodies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWaterBody, setSelectedWaterBody] = useState(null)

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/login')
  //     return
  //   }
  //   fetchWaterBodies()
  // }, [user, router])

  const fetchWaterBodies = async () => {
    try {
      const response = await api.get('/waterbodies')
      setWaterBodies(response.data.waterBodies)
    } catch (error) {
      console.error('Failed to fetch water bodies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#22c55e'
      case 'moderate': return '#eab308'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GIS Map View</h1>
              <p className="text-sm text-gray-600">Interactive map of Delhi water bodies</p>
            </div>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Map and Sidebar */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Map */}
        <div className="flex-1">
          <Map
            waterBodies={waterBodies}
            onWaterBodyClick={setSelectedWaterBody}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Water Bodies ({waterBodies.length})</h2>
            
            {/* Legend */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Healthy (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Moderate (50-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">Critical (0-49)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Water Body Details */}
            {selectedWaterBody && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{selectedWaterBody.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">District:</span> {selectedWaterBody.district}</p>
                    <p><span className="font-medium">Category:</span> {selectedWaterBody.category}</p>
                    <p><span className="font-medium">Area:</span> {selectedWaterBody.area.toLocaleString()} m²</p>
                    <p><span className="font-medium">Health Score:</span> {selectedWaterBody.healthScore}/100</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedWaterBody.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        selectedWaterBody.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedWaterBody.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Water Bodies List */}
            <div className="space-y-2">
              {waterBodies.map((wb) => (
                <Card
                  key={wb._id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedWaterBody?._id === wb._id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedWaterBody(wb)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{wb.name}</p>
                        <p className="text-xs text-gray-600">{wb.district}</p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(wb.status) }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
