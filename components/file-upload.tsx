"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface FileUploadProps {
  id: string
  accept: string
  file: File | null
  onChange: (file: File | null) => void
}

export function FileUpload({ id, accept, file, onChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith(".docx")) {
        onChange(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={`border-2 ${
            isDragging ? "border-[#c99700] bg-amber-50" : "border-slate-200"
          } rounded-lg p-8 text-center transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id={id}
            type="file"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-[#0c2340]/10 rounded-full">
              <Upload className="h-8 w-8 text-[#0c2340]" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#0c2340]">Drag and drop your DOCX file here</h4>
              <p className="text-sm text-slate-500 mt-2">
                Upload your exam schedule document containing all the necessary information
              </p>
            </div>
            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                className="border-[#0c2340] text-[#0c2340] hover:bg-[#0c2340] hover:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border-2 border-green-200 rounded-lg p-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-white rounded-full border-2 border-green-200">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-medium text-green-800 mb-1">File uploaded successfully!</h4>
              <p className="text-sm text-green-700 font-medium">{file.name}</p>
              <p className="text-xs text-green-600 mt-1">{(file.size / 1024).toFixed(2)} KB • DOCX Document</p>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange(null)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
