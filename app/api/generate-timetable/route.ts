import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const file = formData.get("docx_file") as File
    const invigilators = formData.get("invigilators") as string

    if (!file) {
      return NextResponse.json({ detail: [{ msg: "DOCX file is required" }] }, { status: 422 })
    }

    if (!invigilators) {
      return NextResponse.json({ detail: [{ msg: "Invigilators list is required" }] }, { status: 422 })
    }

    const invigilatorList = invigilators.split(",").map(name => name.trim())
    if (invigilatorList.length < 2) {
      return NextResponse.json({ detail: [{ msg: "At least two invigilators are required" }] }, { status: 422 })
    }

    const apiFormData = new FormData()
    apiFormData.append("docx_file", file)
    apiFormData.append("invigilators", invigilators)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-api.com/generate-timetable"

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      body: apiFormData,
    })

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json()
      return NextResponse.json(errorData, { status: apiResponse.status })
    }

    const pdfBlob = await apiResponse.blob()

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
