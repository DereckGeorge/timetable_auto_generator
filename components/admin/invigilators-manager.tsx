"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Plus, Edit, Trash2, Users, Loader2 } from "lucide-react"

interface Invigilator {
  id: number
  name: string
}

export default function InvigilatorsManager() {
  const [invigilators, setInvigilators] = useState<Invigilator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvigilator, setEditingInvigilator] = useState<Invigilator | null>(null)
  const [formData, setFormData] = useState({ name: "" })

  const API_BASE_URL = "http://localhost:9000"

  useEffect(() => {
    fetchInvigilators()
  }, [])

  const fetchInvigilators = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invigilators/`)
      if (!response.ok) throw new Error("Failed to fetch invigilators")
      const data = await response.json()
      setInvigilators(data)
    } catch (err) {
      setError("Failed to fetch invigilators")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      const url = editingInvigilator
        ? `${API_BASE_URL}/api/invigilators/${editingInvigilator.id}`
        : `${API_BASE_URL}/api/invigilators/`

      const response = await fetch(url, {
        method: editingInvigilator ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      })

      if (!response.ok) throw new Error("Failed to save invigilator")

      await fetchInvigilators()
      handleCloseDialog()
    } catch (err) {
      setError("Failed to save invigilator")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this invigilator?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/invigilators/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete invigilator")

      await fetchInvigilators()
    } catch (err) {
      setError("Failed to delete invigilator")
    }
  }

  const handleEdit = (invigilator: Invigilator) => {
    setEditingInvigilator(invigilator)
    setFormData({ name: invigilator.name })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingInvigilator(null)
    setFormData({ name: "" })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingInvigilator(null)
    setFormData({ name: "" })
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#0c2340]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-[#0c2340]">Invigilators</h3>
            <p className="text-sm text-slate-500">Manage exam invigilators</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-[#0c2340] hover:bg-[#1a3a5f]">
              <Plus className="mr-2 h-4 w-4" />
              Add Invigilator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingInvigilator ? "Edit Invigilator" : "Add New Invigilator"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Enter invigilator name"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0c2340] hover:bg-[#1a3a5f]">
                  {editingInvigilator ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {invigilators.map((invigilator) => (
          <Card key={invigilator.id} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#0c2340]">{invigilator.name}</h4>
                  <p className="text-sm text-slate-500">ID: {invigilator.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(invigilator)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(invigilator.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invigilators.length === 0 && !isLoading && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No invigilators found</h3>
            <p className="text-slate-500">Add your first invigilator to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 