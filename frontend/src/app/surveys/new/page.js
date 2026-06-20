"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function NewSurveyPage() {
  const router = useRouter();
  const { user, hasRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [waterBodies, setWaterBodies] = useState([]);
  const [includeWaterQuality, setIncludeWaterQuality] = useState(false);
  const [formData, setFormData] = useState({
    waterBodyId: "",
    waterLevel: "",
    waterQuality: "",
    pollutionObserved: false,
    pollutionType: [],
    encroachmentObserved: false,
    encroachmentDetails: "",
    vegetation: "",
    remarks: "",
    waterQualityData: {
      temp: "",
      do: "",
      ph: "",
      conductivity: "",
      bod: "",
      nitrate: "",
      fecalColiform: "",
      totalColiform: "",
    },
  });

  useEffect(() => {
    if (!user || !hasRole(["admin", "officer"])) {
      router.push("/dashboard");
      return;
    }
    fetchWaterBodies();
  }, [user, router, hasRole]);

  const fetchWaterBodies = async () => {
    try {
      const res = await api.get("/waterbodies");
      setWaterBodies(res.data.waterBodies || []);
    } catch (error) {
      toast.error("Failed to fetch water bodies");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pollutionType: formData.pollutionType.filter((p) => p),
      };

      // Only include water quality data if the checkbox is checked
      if (includeWaterQuality) {
        payload.waterQualityData = {
          temp: parseFloat(formData.waterQualityData.temp),
          do: parseFloat(formData.waterQualityData.do),
          ph: parseFloat(formData.waterQualityData.ph),
          conductivity: parseFloat(formData.waterQualityData.conductivity),
          bod: parseFloat(formData.waterQualityData.bod),
          nitrate: parseFloat(formData.waterQualityData.nitrate),
          fecalColiform: parseFloat(formData.waterQualityData.fecalColiform),
          totalColiform: parseFloat(formData.waterQualityData.totalColiform),
        };
      } else {
        delete payload.waterQualityData;
      }

      const res = await api.post("/surveys", payload);
      toast.success("Survey created successfully");
      router.push("/surveys");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create survey");
    } finally {
      setLoading(false);
    }
  };

  const handlePollutionTypeChange = (type) => {
    setFormData((prev) => {
      const currentTypes = prev.pollutionType || [];
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          pollutionType: currentTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          pollutionType: [...currentTypes, type],
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Survey</h1>
          <p className="text-gray-600 mt-2">
            Conduct a field survey for water body monitoring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water Body *
                </label>
                <select
                  required
                  value={formData.waterBodyId}
                  onChange={(e) =>
                    setFormData({ ...formData, waterBodyId: e.target.value })
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
                  Water Level *
                </label>
                <select
                  required
                  value={formData.waterLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, waterLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select water level</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="dry">Dry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water Quality *
                </label>
                <select
                  required
                  value={formData.waterQuality}
                  onChange={(e) =>
                    setFormData({ ...formData, waterQuality: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select water quality</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vegetation
                </label>
                <select
                  value={formData.vegetation}
                  onChange={(e) =>
                    setFormData({ ...formData, vegetation: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select vegetation level</option>
                  <option value="dense">Dense</option>
                  <option value="moderate">Moderate</option>
                  <option value="sparse">Sparse</option>
                  <option value="none">None</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pollution Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Pollution Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pollutionObserved"
                  checked={formData.pollutionObserved}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pollutionObserved: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="pollutionObserved"
                  className="text-sm font-medium text-gray-700"
                >
                  Pollution Observed
                </label>
              </div>

              {formData.pollutionObserved && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pollution Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Industrial Waste",
                      "Sewage",
                      "Agricultural Runoff",
                      "Plastic Waste",
                      "Oil Spill",
                      "Chemical Contamination",
                      "Thermal Pollution",
                      "Other",
                    ].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.pollutionType.includes(type)}
                          onChange={() => handlePollutionTypeChange(type)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Encroachment Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Encroachment Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="encroachmentObserved"
                  checked={formData.encroachmentObserved}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      encroachmentObserved: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="encroachmentObserved"
                  className="text-sm font-medium text-gray-700"
                >
                  Encroachment Observed
                </label>
              </div>

              {formData.encroachmentObserved && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Encroachment Details
                  </label>
                  <textarea
                    value={formData.encroachmentDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        encroachmentDetails: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the encroachment..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Water Quality Data */}
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Parameters (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeWaterQuality"
                  checked={includeWaterQuality}
                  onChange={(e) => setIncludeWaterQuality(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="includeWaterQuality"
                  className="text-sm font-medium text-gray-700"
                >
                  Include water quality data for AI-powered WQI calculation
                </label>
              </div>

              {includeWaterQuality && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (°C) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required={includeWaterQuality}
                      value={formData.waterQualityData.temp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            temp: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.do}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            do: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      min="0"
                      max="14"
                      value={formData.waterQualityData.ph}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            ph: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.conductivity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            conductivity: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.bod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            bod: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.nitrate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            nitrate: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.fecalColiform}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            fecalColiform: e.target.value,
                          },
                        })
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
                      required={includeWaterQuality}
                      value={formData.waterQualityData.totalColiform}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterQualityData: {
                            ...formData.waterQualityData,
                            totalColiform: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., 100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional observations or notes..."
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating Survey..." : "Create Survey"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
