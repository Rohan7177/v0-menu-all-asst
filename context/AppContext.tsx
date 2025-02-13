"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

type AppContextType = {
  selectedAllergens: string[]
  setSelectedAllergens: React.Dispatch<React.SetStateAction<string[]>>
  analysisResults: string | null
  setAnalysisResults: React.Dispatch<React.SetStateAction<string | null>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [analysisResults, setAnalysisResults] = useState<string | null>(null)

  return (
    <AppContext.Provider value={{ selectedAllergens, setSelectedAllergens, analysisResults, setAnalysisResults }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

