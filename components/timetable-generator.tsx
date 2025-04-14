"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"

export default function TimetableGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [invigilators, setInvigilators] = useState("")
  const [venues, setVenues] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState("upload")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a DOCX file containing the exam schedule")
      return
    }

    if (!invigilators.trim()) {
      setError("Please enter at least two invigilators")
      return
    }

    if (!venues.trim()) {
      setError("Please enter at least one venue")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("docx_file", file)
      formData.append("invigilators", invigilators)
      formData.append("venues", venues)

      const response = await fetch("/api/generate-timetable", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail?.[0]?.msg || "Failed to generate timetable")
      }

      // Get the PDF as a blob
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
    } else if (activeStep === "invigilators" && invigilators.trim()) {
      setActiveStep("venues")
    }
  }

  const isStepComplete = (step: string) => {
    switch (step) {
      case "upload":
        return !!file
      case "invigilators":
        return !!invigilators.trim()
      case "venues":
        return !!venues.trim()
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
            <TabsList className="w-full grid grid-cols-3 bg-slate-100 rounded-none border-b">
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
              <TabsTrigger
                value="venues"
                onClick={() => setActiveStep("venues")}
                className="data-[state=active]:bg-white data-[state=active]:text-[#0c2340] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#c99700] rounded-none"
                disabled={!file || !invigilators.trim()}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Exam Venues</span>
                <span className="sm:hidden">Venues</span>
                {isStepComplete("venues") && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
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
                      <h3 className="text-lg font-medium">Add Invigilators</h3>
                      <p className="text-sm text-slate-500">Enter the names of available invigilators</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invigilators" className="text-[#0c2340] font-medium">
                      Invigilators (comma-separated)
                    </Label>
                    <Textarea
                      id="invigilators"
                      placeholder="Dr. John Doe, Dr. Jane Smith, Prof. Alan Johnson, Dr. Emily Wilson"
                      value={invigilators}
                      onChange={(e) => setInvigilators(e.target.value)}
                      className="min-h-[150px] border-slate-300 focus:border-[#0c2340] focus:ring-[#0c2340]"
                    />
                    <p className="text-xs text-slate-500">
                      Enter names separated by commas. At least two invigilators are required per exam.
                    </p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!invigilators.trim()}
                      className="bg-[#0c2340] hover:bg-[#1a3a5f]"
                    >
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="venues" className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Add Exam Venues</h3>
                      <p className="text-sm text-slate-500">Enter the available venues for exams</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venues" className="text-[#0c2340] font-medium">
                      Venues (comma-separated)
                    </Label>
                    <Textarea
                      id="venues"
                      placeholder="D01, B310, B305, A201, Main Hall, Science Theater"
                      value={venues}
                      onChange={(e) => setVenues(e.target.value)}
                      className="min-h-[150px] border-slate-300 focus:border-[#0c2340] focus:ring-[#0c2340]"
                    />
                    <p className="text-xs text-slate-500">
                      Enter venue codes or names separated by commas. Each exam requires one venue.
                    </p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || !venues.trim()}
                      className="bg-[#c99700] hover:bg-[#b38600] text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Timetable...
                        </>
                      ) : (
                        "Generate Timetable"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-2 border-green-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="bg-white/10 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold">Timetable Generated Successfully!</h3>
                    <p className="text-green-100">Your exam timetable is ready to download and use</p>
                  </div>
                </div>
                <Button asChild className="bg-white text-green-700 hover:bg-green-50">
                  <a href={pdfUrl} download="exam-timetable.pdf">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="w-full mt-4 border-2 border-slate-200 rounded-lg overflow-hidden">
                <iframe src={pdfUrl} className="w-full h-[600px]" title="Generated Timetable PDF" />
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPdfUrl(null)
                    setActiveStep("upload")
                  }}
                  className="border-[#0c2340] text-[#0c2340] hover:bg-[#0c2340] hover:text-white"
                >
                  Create Another Timetable
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-serif font-bold text-[#0c2340] mb-4">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-[#0c2340] text-white rounded-full flex items-center justify-center mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-2">Upload Schedule</h4>
            <p className="text-sm text-slate-600">Upload your DOCX file containing the exam schedule details</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-[#0c2340] text-white rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-2">Add Resources</h4>
            <p className="text-sm text-slate-600">Enter available invigilators and venues for your exams</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-[#c99700] text-white rounded-full flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-2">Get Timetable</h4>
            <p className="text-sm text-slate-600">
              Receive a perfectly balanced timetable with fair workload distribution
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
