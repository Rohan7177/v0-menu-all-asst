import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { image, allergens } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not set" }, { status: 500 })
    }

    if (!image || !allergens || allergens.length === 0) {
      return NextResponse.json({ error: "Missing image or allergens" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this menu image and identify dishes that contain any of the following allergens: ${allergens.join(", ")}. For each dish that contains allergens, specify which allergens it contains. Format the response as a list for easy reading.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    })

    const analysis = response.choices[0]?.message?.content || "No analysis available"

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in analyze-menu route:", error)
    if (error instanceof Error && error.message.includes("has been deprecated")) {
      return NextResponse.json(
        {
          error: "The AI model is currently unavailable. Please try again later or contact support.",
          details: error.message,
        },
        { status: 503 },
      )
    }
    return NextResponse.json(
      {
        error: "Failed to analyze menu",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

