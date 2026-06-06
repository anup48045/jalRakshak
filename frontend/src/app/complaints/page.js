"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ComplaintsPage() {
  const router = useRouter();
  const { user, hasRole } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user || !hasRole(['admin'])) {
      router.push('/dashboard');
      return;
    }
    fetchComplaints();
  }, [user, hasRole, router, filter]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`/citizen-reports?status=${filter}`);
      setComplaints(res.data.reports || []);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/citizen-reports/${complaintId}`, { status: newStatus });
      toast.success("Complaint status updated");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Complaint Management</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="text-sm text-gray-500">No complaints found</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {complaint.title || "Untitled Complaint"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {complaint.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>📍 {complaint.location}</span>
                        <span>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          {complaint.isAnonymous
                            ? "Anonymous"
                            : complaint.reporterName}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status || "pending"}
                    </span>
                  </div>

                  {complaint.image && (
                    <div className="mt-3">
                      <img
                        src={complaint.image}
                        alt="Complaint evidence"
                        className="h-32 w-auto rounded"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    {complaint.status !== "verified" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(complaint._id, "verified")
                        }
                      >
                        Mark Verified
                      </Button>
                    )}
                    {complaint.status !== "in-progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(complaint._id, "in-progress")
                        }
                      >
                        In Progress
                      </Button>
                    )}
                    {complaint.status !== "resolved" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(complaint._id, "resolved")
                        }
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
