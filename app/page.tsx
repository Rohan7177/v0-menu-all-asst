import { AppProvider } from "@/context/AppContext"
import AllergenSelection from "@/components/AllergenSelection"
import CameraComponent from "@/components/CameraComponent"
import AnalysisResults from "@/components/AnalysisResults"

export default function Home() {
  return (
    <AppProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-orange-50">
        <h1 className="text-3xl font-bold text-orange-800 mb-6">Food Allergy Checker</h1>
        <AllergenSelection />
        <CameraComponent />
        <AnalysisResults />
      </main>
    </AppProvider>
  )
}

