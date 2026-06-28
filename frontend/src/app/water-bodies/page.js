"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function WaterBodiesPage() {
  const router = useRouter();
  const { user, hasRole } = useAuthStore();
  const [waterBodies, setWaterBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWaterBody, setEditingWaterBody] = useState(null);
  const [filter, setFilter] = useState({ district: "", category: "", status: "" });

  useEffect(() => {
    if (!user || !hasRole(['admin'])) {
      router.push('/dashboard');
      return;
    }
    fetchWaterBodies();
  }, [user, hasRole, router, filter]);

  const fetchWaterBodies = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.district) params.append('district', filter.district);
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);

      const res = await api.get(`/waterbodies?${params.toString()}`);
      setWaterBodies(res.data.waterBodies || []);
    } catch (error) {
      toast.error("Failed to fetch water bodies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this water body?")) return;

    try {
      await api.delete(`/waterbodies/${id}`);
      toast.success("Water body deleted successfully");
      fetchWaterBodies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete water body");
    }
  };

  const handleEdit = (waterBody) => {
    setEditingWaterBody(waterBody);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingWaterBody(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingWaterBody(null);
    fetchWaterBodies();
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center m-4">
        <h2 className="text-2xl font-bold">Water Bodies Management</h2>
        <Button onClick={handleAddNew}>Add New Water Body</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                value={filter.district}
                onChange={(e) => setFilter({ ...filter, district: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="moderate">Moderate</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Bodies List */}
      <Card>
        <CardHeader>
          <CardTitle>All Water Bodies ({waterBodies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {waterBodies.length === 0 ? (
            <p className="text-sm text-gray-500">No water bodies found</p>
          ) : (
            <div className="h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {waterBodies.map((waterBody) => (
                <div
                  key={waterBody._id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{waterBody.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{waterBody.description || "No description"}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>📍 {waterBody.district}</span>
                        <span>🏷️ {waterBody.category}</span>
                        <span>📐 {waterBody.area} sqm</span>
                        <span>💯 Score: {waterBody.healthScore}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        waterBody.status
                      )}`}
                    >
                      {waterBody.status}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(waterBody)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(waterBody._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <WaterBodyForm
              waterBody={editingWaterBody}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function WaterBodyForm({ waterBody, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: waterBody?.name || "",
    district: waterBody?.district || "",
    area: waterBody?.area || "",
    category: waterBody?.category || "lake",
    healthScore: waterBody?.healthScore || 50,
    description: waterBody?.description || "",
    location: {
      type: "Point",
      coordinates: waterBody?.location?.coordinates || [77.2090, 28.6139]
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        area: Number(formData.area),
        healthScore: Number(formData.healthScore)
      };

      if (waterBody) {
        await api.put(`/waterbodies/${waterBody._id}`, payload);
        toast.success("Water body updated successfully");
      } else {
        await api.post("/waterbodies", payload);
        toast.success("Water body created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save water body");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {waterBody ? "Edit Water Body" : "Add New Water Body"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name of the water body"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District *
          </label>
          <select
            required
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lake">Lake</option>
            <option value="pond">Pond</option>
            <option value="wetland">Wetland</option>
            <option value="reservoir">Reservoir</option>
            <option value="river">River</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (sqm) *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Area in square meters"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Health Score (0-100) *
          </label>
          <input
            type="number"
            required
            min="0"
            max="100"
            value={formData.healthScore}
            onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
            placeholder="Health score (0-100)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description of the water body"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.coordinates[0]}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [parseFloat(e.target.value), formData.location.coordinates[1]]
                }
              })}
              placeholder="Longitude"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.coordinates[1]}
              onChange={(e) => setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: [formData.location.coordinates[0], parseFloat(e.target.value)]
                }
              })}
              placeholder="Latitude"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : (waterBody ? "Update" : "Create")}
          </Button>
        </div>
      </form>
    </div>
  );
}
