"use client"

import { useAppContext } from "@/context/AppContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const commonAllergens = [
  "Peanuts",
  "Cashews",
  "Pistachios",
  "Almonds",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Gluten",
]

export default function AllergenSelection() {
  const { selectedAllergens, setSelectedAllergens } = useAppContext()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAllergenChange = (allergen: string) => {
    setSelectedAllergens((prev) => 
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    )
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-orange-800">Select Your Allergens</h2>
        <button 
          onClick={toggleExpand}
          className="text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
        >
          {isExpanded ? "<< Close" : "Cick to select more >>"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {commonAllergens.slice(0, isExpanded ? undefined : 2).map((allergen) => (
          <div key={allergen} className="flex items-center space-x-2">
            <Checkbox
              id={allergen}
              checked={selectedAllergens.includes(allergen)}
              onCheckedChange={() => handleAllergenChange(allergen)}
            />
            <Label htmlFor={allergen}>{allergen}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

