"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function SurveysPage() {
  const router = useRouter();
  const { user, hasRole } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [filter, setFilter] = useState({ waterBodyId: "" });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
  setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!user || !hasRole(["admin", "officer"])) {
      router.push("/dashboard");
      return;
    }
    fetchSurveys();
  }, [mounted, user, filter]);

  const fetchSurveys = async () => {
    try {
      // const params = new URLSearchParams();
      // if (filter.waterBodyId) params.append("waterBodyId", filter.waterBodyId);
      // if (hasRole(["officer"]) && !hasRole(["admin"])) {
      //   params.append("officerId", user._id);
      // }

      const res = await api.get(`/surveys?officerId=${user.id}`);
      setSurveys(res.data.surveys || []);
    } catch (error) {
      toast.error("Failed to fetch surveys");
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

  const getWQIStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "poor":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
              <p className="text-gray-600 mt-2">
                View and manage water body surveys
              </p>
            </div>
              <Button onClick={() => router.push("/surveys/new")}>
                Create New Survey
              </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : surveys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No surveys found</p>
              
                <Button onClick={() =>router.push("/surveys/new")}>
                  Create Your First Survey
                </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <Card key={survey._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {survey.waterBodyId?.name || "Unknown Water Body"}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {survey.waterBodyId?.district || ""}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Water Level:</span>
                    <span className="text-sm font-medium capitalize">
                      {survey.waterLevel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        survey.waterQuality
                      )}`}
                    >
                      {survey.waterQuality}
                    </span>
                  </div>

                  {survey.wqiResults && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">WQI:</span>
                        <span className="text-sm font-bold">
                          {survey.wqiResults.wqi?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Health Score:</span>
                        <span className="text-sm font-bold">
                          {survey.wqiResults.healthScore?.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getWQIStatusColor(
                            survey.wqiResults.status
                          )}`}
                        >
                          {survey.wqiResults.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {survey.pollutionObserved && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 font-medium">
                        ⚠️ Pollution Observed
                      </span>
                    </div>
                  )}

                  {survey.encroachmentObserved && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-orange-600 font-medium">
                        🚧 Encroachment Observed
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-500">
                      <div>Officer: {survey.officerName}</div>
                      <div>
                        Date: {new Date(survey.createdAt).toISOString().split("T")[0]}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/surveys/${survey._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
