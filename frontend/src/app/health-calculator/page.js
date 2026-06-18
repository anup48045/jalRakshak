"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function HealthCalculatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    temp: "",
    do: "",
    ph: "",
    conductivity: "",
    bod: "",
    nitrate: "",
    fecalColiform: "",
    totalColiform: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        temp: parseFloat(formData.temp),
        do: parseFloat(formData.do),
        ph: parseFloat(formData.ph),
        conductivity: parseFloat(formData.conductivity),
        bod: parseFloat(formData.bod),
        nitrate: parseFloat(formData.nitrate),
        fecalColiform: parseFloat(formData.fecalColiform),
        totalColiform: parseFloat(formData.totalColiform),
      };
      console.log(payload);

      const response = await fetch("http://localhost:8000/calculate-wqi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast.success("Health score calculated successfully");
      } else {
        throw new Error("Failed to calculate health score");
      }
    } catch (error) {
      toast.error(error.message || "Failed to calculate health score");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "poor":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClassificationLabel = (classification) => {
    switch (classification) {
      case 3:
        return "Class A (Excellent)";
      case 2:
        return "Class B (Good)";
      case 1:
        return "Class C (Poor)";
      case 0:
        return "Class D (Critical)";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Water Health Score Calculator</h1>
          <p className="text-gray-600 mt-2">
            Calculate water quality index and health score using AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.temp}
                    onChange={(e) =>
                      setFormData({ ...formData, temp: e.target.value })
                    }
                    placeholder="e.g., 25.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dissolved Oxygen (mg/L) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.do}
                    onChange={(e) =>
                      setFormData({ ...formData, do: e.target.value })
                    }
                    placeholder="e.g., 6.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH Level *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0"
                    max="14"
                    value={formData.ph}
                    onChange={(e) =>
                      setFormData({ ...formData, ph: e.target.value })
                    }
                    placeholder="e.g., 7.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conductivity (µS/cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.conductivity}
                    onChange={(e) =>
                      setFormData({ ...formData, conductivity: e.target.value })
                    }
                    placeholder="e.g., 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BOD (mg/L) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.bod}
                    onChange={(e) =>
                      setFormData({ ...formData, bod: e.target.value })
                    }
                    placeholder="e.g., 3.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nitrate (mg/L) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.nitrate}
                    onChange={(e) =>
                      setFormData({ ...formData, nitrate: e.target.value })
                    }
                    placeholder="e.g., 10.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecal Coliform (MPN/100mL) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.fecalColiform}
                    onChange={(e) =>
                      setFormData({ ...formData, fecalColiform: e.target.value })
                    }
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Coliform (MPN/100mL) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.totalColiform}
                    onChange={(e) =>
                      setFormData({ ...formData, totalColiform: e.target.value })
                    }
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Calculating..." : "Calculate Health Score"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {result.healthScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Health Score (0-100)</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">WQI</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {result.wqi.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Classification</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getClassificationLabel(result.classification)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Status Guidelines
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Excellent (WQI &lt; 25) - Safe for all uses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Good (WQI 25-50) - Safe with treatment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Poor (WQI 50-75) - Requires treatment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Critical (WQI &gt; 75) - Unsafe for use</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Enter water quality parameters and click "Calculate Health Score" to see results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
