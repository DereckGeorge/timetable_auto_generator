import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Get the file, invigilators, and venues from the form data
    const file = formData.get("docx_file") as File
    const invigilators = formData.get("invigilators") as string
    const venues = formData.get("venues") as string

    // Validate inputs
    if (!file) {
      return NextResponse.json({ detail: [{ msg: "DOCX file is required" }] }, { status: 422 })
    }

    if (!invigilators) {
      return NextResponse.json({ detail: [{ msg: "Invigilators list is required" }] }, { status: 422 })
    }

    if (!venues) {
      return NextResponse.json({ detail: [{ msg: "Venues list is required" }] }, { status: 422 })
    }

    // Validate that we have enough invigilators and venues
    const invigilatorList = invigilators.split(",").map(name => name.trim())
    const venueList = venues.split(",").map(name => name.trim())

    if (invigilatorList.length < 2) {
      return NextResponse.json({ detail: [{ msg: "At least two invigilators are required" }] }, { status: 422 })
    }

    if (venueList.length < 1) {
      return NextResponse.json({ detail: [{ msg: "At least one venue is required" }] }, { status: 422 })
    }

    // Create a new FormData object to send to your backend API
    const apiFormData = new FormData()
    apiFormData.append("docx_file", file)
    apiFormData.append("invigilators", invigilators)
    apiFormData.append("venues", venues)

    // Replace with your actual API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-api.com/generate-timetable"

    // Send the request to your backend API
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      body: apiFormData,
    })

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json()
      return NextResponse.json(errorData, { status: apiResponse.status })
    }

    // Get the PDF from the API response
    const pdfBlob = await apiResponse.blob()

    // Return the PDF as the response
    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=exam-timetable.pdf",
      },
    })
  } catch (error) {
    console.error("Error generating timetable:", error)
    return NextResponse.json({ detail: [{ msg: "An error occurred while generating the timetable" }] }, { status: 500 })
  }
}
