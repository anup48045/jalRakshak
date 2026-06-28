// export default async function Contact() {
//     try {
//         const res = await fetch(
//             "https://rtwqmsdb1.cpcb.gov.in/data/internet/layers/10/index.json",
//             {
//                 cache: "no-store",
//             }
//         );

//         console.log("Status:", res.status);
//         console.log("Content-Type:", res.headers.get("content-type"));

//         const text = await res.text();
//         console.log(text.slice(0, 500));

//         return (
//             <div>
//                 <h3>CPCB Water Quality Live Data</h3>
//                 <pre>{text}</pre>
//             </div>
//         );
//     } catch (error) {
//         console.error(error);

//         return (
//             <div>
//                 Error: {error.message}
//             </div>
//         );
//     }
// }
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/cpcb");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Group data by station
  const groupedData = Array.isArray(data) ? data.reduce((acc, item) => {
    const stationKey = item.station_id || item.station_no || item.station_name;
    if (!acc[stationKey]) {
      acc[stationKey] = {
        station_name: item.station_name,
        station_id: item.station_id,
        station_no: item.station_no,
        station_latitude: item.station_latitude,
        station_longitude: item.station_longitude,
        territory_name: item.territory_name,
        station_diary_status: item.station_diary_status,
        station_status_remark: item.station_status_remark,
        parameters: []
      };
    }
    acc[stationKey].parameters.push({
      ts_id: item.ts_id,
      ts_value: item.ts_value,
      ts_unitsymbol: item.ts_unitsymbol,
      timestamp: item.timestamp,
      stationparameter_longname: item.stationparameter_longname,
      stationparameter_name: item.stationparameter_name,
      MAX_RANGE: item.MAX_RANGE
    });
    return acc;
  }, {}) : {};

  const stations = Object.values(groupedData);

  const getParameterColor = (paramName) => {
    const name = paramName?.toLowerCase() || "";
    if (name.includes("ph")) return "bg-purple-100 text-purple-800";
    if (name.includes("temperature") || name.includes("wt")) return "bg-orange-100 text-orange-800";
    if (name.includes("bod")) return "bg-red-100 text-red-800";
    if (name.includes("do") || name.includes("dissolved")) return "bg-blue-100 text-blue-800";
    if (name.includes("nitrate")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getValueStatus = (value, paramName) => {
    const name = paramName?.toLowerCase() || "";
    if (name.includes("ph")) {
      if (value >= 6.5 && value <= 8.5) return { status: "Good", color: "text-green-600" };
      if (value >= 6 && value <= 9) return { status: "Moderate", color: "text-yellow-600" };
      return { status: "Poor", color: "text-red-600" };
    }
    if (name.includes("temperature") || name.includes("wt")) {
      if (value >= 20 && value <= 30) return { status: "Good", color: "text-green-600" };
      if (value >= 15 && value <= 35) return { status: "Moderate", color: "text-yellow-600" };
      return { status: "Poor", color: "text-red-600" };
    }
    if (name.includes("bod")) {
      if (value <= 3) return { status: "Good", color: "text-green-600" };
      if (value <= 5) return { status: "Moderate", color: "text-yellow-600" };
      return { status: "Poor", color: "text-red-600" };
    }
    return { status: "N/A", color: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Real-Time Water Quality Monitoring
          </h1>
          <p className="text-gray-600 mt-2">
            Live data from CPCB monitoring stations across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[500px] overflow-y-auto">
          {stations.length > 0 ? (
            stations.map((station, index) => (
              <Card key={station.station_id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {station.station_name || "Unknown Station"}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {station.territory_name || "Unknown Territory"}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>ID: {station.station_no || station.station_id}</span>
                    {station.station_latitude && station.station_longitude && (
                      <span>
                        | {station.station_latitude?.toFixed(4)}, {station.station_longitude?.toFixed(4)}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {station.parameters.map((param, paramIndex) => {
                      const valueStatus = getValueStatus(
                        param.ts_value,
                        param.stationparameter_longname
                      );
                      return (
                        <div
                          key={param.ts_id || paramIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getParameterColor(
                                  param.stationparameter_longname
                                )}`}
                              >
                                {param.stationparameter_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {param.stationparameter_longname}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {param.ts_value?.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-600">
                                {param.ts_unitsymbol || "---"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-sm font-medium ${valueStatus.color}`}>
                              {valueStatus.status}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(param.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {station.station_diary_status && (
                    <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800">
                      <div className="font-medium mb-1">Status Notes:</div>
                      <div className="line-clamp-2">
                        {station.station_diary_status
                          .split("<br>")
                          .slice(-2)
                          .join(" | ")}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No monitoring data available</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data Source: CPCB Real-Time Water Quality Monitoring System</p>
          <p>Last Updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}