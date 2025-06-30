"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LogOut, Users, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import InvigilatorsManager from "@/components/admin/invigilators-manager"
import VenuesManager from "@/components/admin/venues-manager"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication on component mount
    const auth = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")
    
    if (auth === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c2340] mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-[#0c2340] text-white py-4 border-b-4 border-[#c99700]">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full overflow-hidden border-2 border-[#c99700]">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                  <path d="M12 2L2 6V8H22V6L12 2Z" fill="#0c2340" />
                  <path d="M4 10V17C4 17 4 20 12 20C20 20 20 17 20 17V10" stroke="#0c2340" strokeWidth="2" fill="none" />
                  <path d="M12 8V15M8 10V15M16 10V15" stroke="#c99700" strokeWidth="2" />
                  <path d="M2 8H22" stroke="#c99700" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-xs md:text-sm text-slate-300">Manage invigilators and venues</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Welcome, {userEmail}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-[#0c2340]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0c2340] mb-3">
              System Management
            </h2>
            <p className="text-slate-600">
              Manage invigilators and venues for the exam timetable system.
            </p>
          </div>

          <Tabs defaultValue="invigilators" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger
                value="invigilators"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0c2340] data-[state=active]:shadow-none"
              >
                <Users className="mr-2 h-4 w-4" />
                Invigilators
              </TabsTrigger>
              <TabsTrigger
                value="venues"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0c2340] data-[state=active]:shadow-none"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Venues
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invigilators" className="mt-6">
              <InvigilatorsManager />
            </TabsContent>

            <TabsContent value="venues" className="mt-6">
              <VenuesManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 