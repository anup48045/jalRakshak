"use client";
import React, { useState } from 'react'
import BarGraph from '@/components/BarGraph/page'
import WaterBodyList from '@/components/WaterBodyList/page'



const Reports = () => {
  const [selectedWaterBodyId, setSelectedWaterBodyId] = useState(null)

  return (
    <div className="space-y-6 flex md:flex-row flex-col">
      <WaterBodyList onWaterBodySelect={setSelectedWaterBodyId}/>
      <BarGraph waterBodyId={selectedWaterBodyId} />
      {/* <LineGraph /> */}
      {/* <HeatMap /> */}
    </div>
  )
}

export default Reports
