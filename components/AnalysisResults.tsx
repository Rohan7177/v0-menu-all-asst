"use client"

import { useAppContext } from "@/context/AppContext"

export default function AnalysisResults() {
  const { analysisResults } = useAppContext()

  if (!analysisResults) {
    return null
  }

  const isError = analysisResults.startsWith("Error:")

  return (
    <div className="w-full max-w-md mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-800 mb-4">Analysis Results</h2>
      <div className={`text-gray-700 whitespace-pre-wrap ${isError ? "text-red-500" : ""}`}>{analysisResults}</div>
    </div>
  )
}

