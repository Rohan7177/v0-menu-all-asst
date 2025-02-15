"use client"

import { useAppContext } from "@/context/AppContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

  const handleAllergenChange = (allergen: string) => {
    setSelectedAllergens((prev) => (prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]))
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-800 mb-4">Select Your Allergens</h2>
      <div className="grid grid-cols-2 gap-4">
        {commonAllergens.map((allergen) => (
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

