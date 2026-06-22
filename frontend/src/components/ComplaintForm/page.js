"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ComplaintForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issueType: "pollution",
    description: "",
    locationName:"",
    location: "",
    waterBodyId: "",
    waterBodyName:"",
    reporterName: user?.name || "",
    reporterEmail: user?.email || "",
    reporterPhone: "",
    images: [],
    isAnonymous: !user, // Default to anonymous if not logged in
  });

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if image is too large
        const maxWidth = 1200;
        const maxHeight = 1200;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.7
        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (e) => callback(e.target.result);
          },
          "image/jpeg",
          0.7
        );
      };
    };
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxFileSize = 2 * 1024 * 1024; // 2MB per image
    const maxTotalSize = 10 * 1024 * 1024; // 10MB total

    let totalSize = formData.images.reduce((acc, img) => acc + img.length, 0);

    files.forEach((file) => {
      if (file.size > maxFileSize) {
        toast.error(`Image "${file.name}" is too large (max 2MB). It will be compressed.`);
      }

      compressImage(file, (compressedImage) => {
        totalSize += compressedImage.length;

        if (totalSize > maxTotalSize) {
          toast.error("Total image size exceeds 10MB limit. Please remove some images.");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, compressedImage],
        }));
      });
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title || null,
        issueType: formData.issueType,
        description: formData.description,
        locationName: formData.locationName,
        location: formData.location,
        waterBodyId: formData.waterBodyId || null,
        waterBodyName: formData.waterBodyName || null,
        images: formData.images,
      };

      if (!formData.isAnonymous && user) {
        payload.reporterName = formData.reporterName;
        payload.reporterEmail = formData.reporterEmail;
        payload.reporterPhone = formData.reporterPhone;
      }
      console.log(
        "Payload size:",
        JSON.stringify(payload).length / 1024 / 1024,
        "MB"
      );
      console.log("Sent complaints:", payload)
      await api.post("/citizen-reports", payload);

      toast.success("Complaint submitted successfully");
      router.push(user ? "/dashboard/citizen" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {user ? "Submit Pollution Complaint" : "Submit Anonymous Complaint"}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Report pollution or contamination in water bodies
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Add a title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type *
              </label>
              <select
                required
                value={formData.issueType}
                onChange={(e) =>
                  setFormData({ ...formData, issueType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pollution">Pollution</option>
                <option value="encroachment">Encroachment</option>
                <option value="waste_dumping">Waste Dumping</option>
                <option value="sewage">Sewage</option>
                <option value="drying">Drying</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the pollution issue in detail"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name *
              </label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) =>
                  setFormData({ ...formData, locationName: e.target.value })
                }
                placeholder="Address or location of the polluted water body"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Coordinates
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Address or location of the polluted water body"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water Body (Optional)
              </label>
              <input
                type="text"
                value={formData.waterBodyName}
                onChange={(e) =>
                  setFormData({ ...formData, waterBodyName: e.target.value })
                }
                placeholder="WaterBody Name if known"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload multiple images (max 2MB each, 10MB total).
              </p>

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images ({formData.images.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!formData.isAnonymous && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reporterName}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterName: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.reporterEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterEmail: e.target.value })
                    }
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.reporterPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterPhone: e.target.value })
                    }
                    placeholder="Your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {user && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, isAnonymous: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Submit anonymously (your name will not be shown)
                </label>
              </div>
            )}

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                <p className="text-sm">
                  You are submitting as a guest. Your complaint will be anonymous.
                  <a href="/login" className="underline ml-1 mr-1">
                    Login to track your complaint status.
                  </a>
                  If you submit your complaint without login you can't track your complaint status.
                </p>
              </div>
            )}

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
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
