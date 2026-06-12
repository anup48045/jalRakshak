"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export default function HeatMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/heatmap")
      .then((res) => res.json())
      .then(setPoints)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([28.6139, 77.209], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !points.length) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity / 100]);

    if (heatLayerRef.current) {
      heatLayerRef.current.setLatLngs(heatPoints);
    } else {
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: '#22c55e', // green (healthy, low intensity / low pollution)
          0.5: '#eab308', // yellow/moderate
          1.0: '#ef4444'  // red/critical (high intensity / high pollution)
        }
      }).addTo(map);
    }
  }, [points]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "98%", height: "450px", margin:"10px"}}
      className="rounded-lg overflow-hidden "
    />
  );
}

