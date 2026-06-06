"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "@/lib/axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-lg mb-2">Year: {label}</p>
        <p className="text-sm mb-1">
          <span className="font-medium">Health Score:</span> {data.healthScore}
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">DO:</span> {data.do} mg/L
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">pH:</span> {data.ph}
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">BOD:</span> {data.bod} mg/L
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">Nitrate:</span> {data.nitrate} mg/L
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">Fecal Coliform:</span> {data.fecalColiform} MPN/100mL
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">Total Coliform:</span> {data.totalColiform} MPN/100mL
        </p>
        <p className="text-sm mb-1">
          <span className="font-medium">Temperature:</span> {data.temperature}°C
        </p>
        {data.turbidity && (
          <p className="text-sm mb-1">
            <span className="font-medium">Turbidity:</span> {data.turbidity} NTU
          </p>
        )}
        {data.conductivity && (
          <p className="text-sm">
            <span className="font-medium">Conductivity:</span> {data.conductivity} µS/cm
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function BarGraph({ waterBodyId }) {
  const [data, setData] = useState([]);
  const [waterBodyName, setWaterBodyName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      if (!waterBodyId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(
          `/waterquality/waterbody/${waterBodyId}/health-trend`
        );

        setData(res.data.data);
        setWaterBodyName(res.data.waterBodyName || "");
      } catch (error) {
        console.error("Error fetching health trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [waterBodyId]);

  const getBarColor = (healthScore) => {
    if (healthScore >= 70) return "#22c55e"; // green
    if (healthScore >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  if (loading) {
    return (
      <div className="w-full h-[350px] bg-white rounded-lg shadow p-4 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!waterBodyId) {
    return (
      <div className="w-full h-[350px] bg-white rounded-lg shadow p-4 flex items-center justify-center">
        <p className="text-gray-500">Select a water body to view health trends</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-[350px] bg-white rounded-lg shadow p-4 flex items-center justify-center">
        <p className="text-gray-500">No health data available for this water body</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">
        {waterBodyName} Health Score Trend
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis domain={[0, 100]} label={{ value: 'Health Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="healthScore" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.healthScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
