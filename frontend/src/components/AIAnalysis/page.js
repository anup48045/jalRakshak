"use client";

import React, { useState } from "react";

export default function AIAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze image. Please make sure the AI module is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getPollutionLevelColor = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPollutantLabel = (label) => {
    const labels = {
      water_hyacinth: "Water Hyacinth",
      murky_water: "Murky/Turbid Water",
      foam_pollution: "Foam Pollution",
      garbage: "Garbage/Debris",
      sewage: "Sewage Indicators",
    };
    return labels[label] || label;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Water Pollution Detection</h2>
      <p className="text-gray-600 mb-6">
        Upload an image of a water body to detect pollution indicators using AI.
      </p>

      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Analyze Button */}
        {selectedFile && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {analyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && result.success && (
          <div className="space-y-4">
            {/* Overall Pollution Level */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Overall Pollution Level</h3>
              <span
                className={`inline-block px-4 py-2 rounded-full text-lg font-semibold border-2 ${getPollutionLevelColor(
                  result.overall_pollution_level
                )}`}
              >
                {result.overall_pollution_level.toUpperCase()}
              </span>
            </div>

            {/* Detected Pollutants */}
            {result.detected_pollutants && result.detected_pollutants.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Detected Pollutants</h3>
                <div className="space-y-3">
                  {result.detected_pollutants.map((pollutant, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          {getPollutantLabel(pollutant.label)}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {(pollutant.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${pollutant.confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.detected_pollutants && result.detected_pollutants.length === 0 && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                No pollutants detected. The water appears clean!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
