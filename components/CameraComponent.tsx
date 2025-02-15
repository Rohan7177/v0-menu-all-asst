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
    <div className="w-full max-w-md">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleFileClick} 
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Upload className="mr-2" />
          Upload Image
        </Button>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Menu thumbnail"
            className="h-12 w-12 object-cover rounded-lg shadow-md"
          />
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleCapture} ref={fileInputRef} className="hidden" />
      {imageSrc && (
        <Button
          onClick={handleAnalyze}
          className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
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
      )}
    </div>
  )
}
