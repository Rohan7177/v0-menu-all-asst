import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Food Allergy Checker",
    short_name: "AllergyCheck",
    description: "Check restaurant menus for food allergens",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#9a3412",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

