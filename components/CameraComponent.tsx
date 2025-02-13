"use client"

import { useState, useRef } from "react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Camera, Loader2, Upload } from "lucide-react"

export default function CameraComponent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { selectedAllergens, setAnalysisResults } = useAppContext()

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImageSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!imageSrc || selectedAllergens.length === 0) {
      alert("Please capture an image or select one from your library, and select at least one allergen.")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageSrc,
          allergens: selectedAllergens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze menu")
      }

      const data = await response.json()
      setAnalysisResults(data.analysis)
    } catch (error) {
      console.error("Error analyzing menu:", error)
      setAnalysisResults(`Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full max-w-md mt-6">
      <div className="flex justify-between gap-4 mb-4">
        <Button onClick={handleCameraClick} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
          <Camera className="mr-2" />
          Take Photo
        </Button>
        <Button onClick={handleFileClick} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
          <Upload className="mr-2" />
          Upload Image
        </Button>
      </div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        ref={cameraInputRef}
        className="hidden"
      />
      <input type="file" accept="image/*" onChange={handleCapture} ref={fileInputRef} className="hidden" />
      {imageSrc && (
        <div className="mt-4">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Captured or selected menu"
            className="w-full rounded-lg shadow-md mb-4"
          />
          <Button
            onClick={handleAnalyze}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Menu"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
