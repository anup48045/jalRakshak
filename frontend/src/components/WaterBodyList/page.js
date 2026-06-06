"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function WaterBodyList({ onWaterBodySelect }) {
  const [waterBodies, setWaterBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchWaterBodies = async () => {
      try {
        const res = await api.get("/waterbodies");
        setWaterBodies(res.data.waterBodies);
      } catch (error) {
        console.error("Error fetching water bodies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterBodies();
  }, []);

  const handleSelect = (waterBody) => {
    setSelectedId(waterBody._id);
    if (onWaterBodySelect) {
      onWaterBodySelect(waterBody._id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-4">
        <p className="text-gray-500">Loading water bodies...</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Water Bodies</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {waterBodies.length === 0 ? (
          <p className="text-gray-500">No water bodies found</p>
        ) : (
          waterBodies.map((waterBody) => (
            <div
              key={waterBody._id}
              onClick={() => handleSelect(waterBody)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedId === waterBody._id
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{waterBody.name}</h3>
                  <p className="text-sm text-gray-600">{waterBody.district}</p>
                  <p className="text-xs text-gray-500 capitalize">{waterBody.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      waterBody.status
                    )}`}
                  >
                    {waterBody.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    Score: {waterBody.healthScore}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
