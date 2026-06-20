"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function WaterQualityForm() {
  const router = useRouter();
  const { user, hasRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [waterBodies, setWaterBodies] = useState([]);
  const [fetchingWaterBodies, setFetchingWaterBodies] = useState(true);
  const [qualityData, setQualityData] = useState([]);
  const [formData, setFormData] = useState({
    waterBodyId: "",
    name: "",
    year: new Date().getFullYear(),
    do: "",
    ph: "",
    bod: "",
    nitrate: "",
    fecalColiform: "",
    totalColiform: "",
    temperature: "",
    turbidity: "",
    conductivity: "",
    labName: "",
  });

  useEffect(() => {
    if (!user || !hasRole(['admin', 'officer'])) {
      router.push('/dashboard');
      return;
    }
    fetchWaterBodies();
    fetchQualityData();
  }, [user, hasRole, router]);

  const fetchQualityData = async () => {
    try {
      const res = await api.get("/waterquality");
      setQualityData(res.data.records || []);
    } catch (error) {
      console.error("Failed to fetch water quality data:", error);
      toast.error("Failed to load water quality data");
    }
  };

  const fetchWaterBodies = async () => {
    try {
      const res = await api.get("/waterbodies");
      setWaterBodies(res.data.waterBodies);
    } catch (error) {
      toast.error("Failed to fetch water bodies");
    } finally {
      setFetchingWaterBodies(false);
    }
  };
  const handleWaterBodyChange = (waterBodyId) => {
  console.log("Received waterBodyId (in handleWaterBodyChange):",waterBodyId)
  console.log("Fetched QualityData:",qualityData)
  const currentYear = new Date().getFullYear();

  const quality = qualityData.find(
    q =>
      q.waterBodyId._id === waterBodyId &&
      q.year === currentYear
  );

  if (quality) {
    setFormData({
      waterBodyId,
      name: quality.name || "",
      year: quality.year,
      do: quality.do,
      ph: quality.ph,
      bod: quality.bod,
      nitrate: quality.nitrate,
      fecalColiform: quality.fecalColiform,
      totalColiform: quality.totalColiform,
      temperature: quality.temperature,
      turbidity: quality.turbidity,
      conductivity: quality.conductivity,
      labName: quality.labName || "",
    });
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        do: parseFloat(formData.do),
        ph: parseFloat(formData.ph),
        bod: parseFloat(formData.bod),
        nitrate: parseFloat(formData.nitrate),
        fecalColiform: parseFloat(formData.fecalColiform),
        totalColiform: parseFloat(formData.totalColiform),
        temperature: parseFloat(formData.temperature),
        year: parseInt(formData.year),
        turbidity: formData.turbidity ? parseFloat(formData.turbidity) : undefined,
        conductivity: formData.conductivity ? parseFloat(formData.conductivity) : undefined,
      };

      await api.post("/waterquality", data);
      toast.success("Water quality data updated successfully");
      router.push("/dashboard/officer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update water quality");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !hasRole(['admin', 'officer'])) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Update Water Quality Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Enter water quality measurements for a water body
          </p>
        </CardHeader>
        <CardContent>
          {fetchingWaterBodies ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Water Body Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Body *
                  </label>
                  <select
                    required
                    value={formData.waterBodyId}
                    onChange={(e) =>
                      {setFormData({ ...formData, waterBodyId: e.target.value }), handleWaterBodyChange(e.target.value)} 
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a water body</option>
                    {waterBodies.map((wb) => (
                      <option key={wb._id} value={wb._id}>
                        {wb.name} - {wb.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Record Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Monthly Quality Check"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2100"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lab Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.labName}
                    onChange={(e) =>
                      setFormData({ ...formData, labName: e.target.value })
                    }
                    placeholder="e.g., Delhi Water Testing Lab"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Water Quality Parameters */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Water Quality Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dissolved Oxygen (DO) mg/L *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="20"
                      step="0.01"
                      value={formData.do}
                      onChange={(e) =>
                        setFormData({ ...formData, do: e.target.value })
                      }
                      placeholder="0-20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      pH Level *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="14"
                      step="0.01"
                      value={formData.ph}
                      onChange={(e) =>
                        setFormData({ ...formData, ph: e.target.value })
                      }
                      placeholder="0-14"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BOD mg/L *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.bod}
                      onChange={(e) =>
                        setFormData({ ...formData, bod: e.target.value })
                      }
                      placeholder="Biological Oxygen Demand"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nitrate mg/L *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.nitrate}
                      onChange={(e) =>
                        setFormData({ ...formData, nitrate: e.target.value })
                      }
                      placeholder="Nitrate concentration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecal Coliform MPN/100mL *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.fecalColiform}
                      onChange={(e) =>
                        setFormData({ ...formData, fecalColiform: e.target.value })
                      }
                      placeholder="Fecal Coliform count"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Coliform MPN/100mL *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.totalColiform}
                      onChange={(e) =>
                        setFormData({ ...formData, totalColiform: e.target.value })
                      }
                      placeholder="Total Coliform count"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature °C *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.temperature}
                      onChange={(e) =>
                        setFormData({ ...formData, temperature: e.target.value })
                      }
                      placeholder="Water temperature"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turbidity NTU (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.turbidity}
                      onChange={(e) =>
                        setFormData({ ...formData, turbidity: e.target.value })
                      }
                      placeholder="Turbidity measurement"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conductivity µS/cm (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.conductivity}
                      onChange={(e) =>
                        setFormData({ ...formData, conductivity: e.target.value })
                      }
                      placeholder="Conductivity measurement"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Parameter Ranges Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Standard Parameter Ranges:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• DO: 0-20 mg/L (optimal: greater than 6 mg/L)</li>
                  <li>• pH: 0-14 (optimal: 6.5-8.5)</li>
                  <li>• BOD: less than 3 mg/L is good</li>
                  <li>• Fecal Coliform: less than 500 MPN/100mL is safe</li>
                  <li>• Total Coliform: less than 2500 MPN/100mL is safe</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Submitting..." : "Submit Data"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
