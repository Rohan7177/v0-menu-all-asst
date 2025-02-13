"use client"

import { useState, useRef } from "react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Camera, Image, Loader2 } from "lucide-react"

export default function CameraComponent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!imageSrc || selectedAllergens.length === 0) {
      alert("Please capture an image and select at least one allergen.")
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
      <Button onClick={handleCameraClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-4">
        {imageSrc ? <Image className="mr-2" /> : <Camera className="mr-2" />}
        {imageSrc ? "Retake Photo" : "Take Photo of Menu"}
      </Button>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        ref={fileInputRef}
        className="hidden"
      />
      {imageSrc && (
        <div className="mt-4">
          <img src={imageSrc || "/placeholder.svg"} alt="Captured menu" className="w-full rounded-lg shadow-md mb-4" />
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

