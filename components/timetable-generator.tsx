"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invigilator {
  id: number
  name: string
}

export default function TimetableGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [invigilators, setInvigilators] = useState<Invigilator[]>([])
  const [selectedInvigilators, setSelectedInvigilators] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState("upload")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invigilatorsResponse = await fetch("http://localhost:9000/api/invigilators/", {
          headers: {
            'Accept': 'application/json',
          },
        })
        if (!invigilatorsResponse.ok) {
          throw new Error(`Failed to fetch invigilators: ${invigilatorsResponse.statusText}`)
        }
        const invigilatorsData = await invigilatorsResponse.json()
        setInvigilators(invigilatorsData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a DOCX file containing the exam schedule")
      return
    }

    if (selectedInvigilators.length < 2) {
      setError("Please select at least two invigilators")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("docx_file", file)
      
      const selectedInvigilatorNames = selectedInvigilators
        .map(id => invigilators.find(i => i.id === id)?.name)
        .filter((name): name is string => name !== undefined)

      formData.append("invigilators", selectedInvigilatorNames.join(", "))

      const response = await fetch("/api/generate-timetable", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail?.[0]?.msg || "Failed to generate timetable")
      }

      const pdfBlob = await response.blob()
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (activeStep === "upload" && file) {
      setActiveStep("invigilators")
    }
  }

  const isStepComplete = (step: string) => {
    switch (step) {
      case "upload":
        return !!file
      case "invigilators":
        return selectedInvigilators.length >= 2
      default:
        return false
    }
  }

  return (
    <div className="space-y-8">
      {!pdfUrl ? (
        <Card className="border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0c2340] to-[#1a3a5f] p-4 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">Exam Timetable Generator</h3>
                <p className="text-sm text-slate-300">Follow the steps below to create your timetable</p>
              </div>
            </div>
          </div>

          <Tabs value={activeStep} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-slate-100 rounded-none border-b">
              <TabsTrigger
                value="upload"
                onClick={() => setActiveStep("upload")}
                className="data-[state=active]:bg-white data-[state=active]:text-[#0c2340] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#c99700] rounded-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Upload Schedule</span>
                <span className="sm:hidden">Upload</span>
                {isStepComplete("upload") && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
              </TabsTrigger>
              <TabsTrigger
                value="invigilators"
                onClick={() => setActiveStep("invigilators")}
                className="data-[state=active]:bg-white data-[state=active]:text-[#0c2340] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#c99700] rounded-none"
                disabled={!file}
              >
                <Users className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Invigilators</span>
                <span className="sm:hidden">Staff</span>
                {isStepComplete("invigilators") && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="upload" className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Upload Exam Schedule</h3>
                      <p className="text-sm text-slate-500">Upload your DOCX file containing the exam schedule</p>
                    </div>
                  </div>

                  <FileUpload id="file-upload" accept=".docx" file={file} onChange={setFile} />

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!file}
                      className="bg-[#0c2340] hover:bg-[#1a3a5f]"
                    >
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="invigilators" className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Select Invigilators</h3>
                      <p className="text-sm text-slate-500">Choose the invigilators for the exams</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invigilators" className="text-[#0c2340] font-medium">
                      Invigilators
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        const id = parseInt(value)
                        if (!selectedInvigilators.includes(id)) {
                          setSelectedInvigilators([...selectedInvigilators, id])
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select invigilators" />
                      </SelectTrigger>
                      <SelectContent>
                        {invigilators.map((invigilator) => (
                          <SelectItem key={invigilator.id} value={invigilator.id.toString()}>
                            {invigilator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 space-y-2">
                      {selectedInvigilators.map((id) => {
                        const invigilator = invigilators.find((i) => i.id === id)
                        return (
                          <div key={id} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                            <span>{invigilator?.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInvigilators(selectedInvigilators.filter((i) => i !== id))}
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-slate-500">
                      Select at least two invigilators. You can remove selected invigilators by clicking the Remove button.
                    </p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || selectedInvigilators.length < 2}
                      className="bg-[#0c2340] hover:bg-[#1a3a5f]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Timetable <Download className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </Card>
      ) : (
        <Card className="border-2 border-slate-200 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-medium">Timetable Generated Successfully!</h3>
              <p className="text-slate-600">Your exam timetable has been generated and is ready to download.</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  className="bg-[#0c2340] hover:bg-[#1a3a5f]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPdfUrl(null)
                    setFile(null)
                    setSelectedInvigilators([])
                    setActiveStep("upload")
                  }}
                >
                  Generate Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
