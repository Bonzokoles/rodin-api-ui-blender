import { NextResponse } from "next/server"

const API_KEY = "vibecoding" // Public API key

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Sprawdź czy są parametry kolorów
    const useColors = formData.get("use_colors") === "true"
    const colorMode = formData.get("color_mode")
    const preserveColors = formData.get("preserve_colors")

    // Dodaj parametry kolorów jeśli są ustawione
    if (useColors) {
      if (colorMode) formData.append("color_mode", colorMode.toString())
      if (preserveColors) formData.append("preserve_colors", preserveColors.toString())
    }

    // Forward the request to the Hyper3D API
    const response = await fetch("https://hyperhuman.deemos.com/api/v2/rodin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API request failed: ${response.status}`, details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Rodin API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
