import TimetableGenerator from "@/components/timetable-generator"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-[#0c2340] text-white py-4 border-b-4 border-[#c99700]">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <UniversityCrest />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">Timetable Generator</h1>
              <p className="text-xs md:text-sm text-slate-300">Coict Timetable Generator System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="hover:text-[#c99700] cursor-pointer transition-colors">Dashboard</span>
            <span className="hover:text-[#c99700] cursor-pointer transition-colors">Resources</span>
            <span className="hover:text-[#c99700] cursor-pointer transition-colors">Help</span>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-[#0c2340]">
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0c2340] mb-3">Exam Timetable Generator</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Streamline your examination scheduling process with our advanced timetable generation system. Upload your
              exam schedule, add invigilators and venues to create a perfectly balanced timetable.
            </p>
          </div>

          <TimetableGenerator />
        </div>
      </main>

      <footer className="bg-[#0c2340] text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-300">
            © {new Date().getFullYear()} Timetable Generator | Coict Timetable Generator System
          </p>
        </div>
      </footer>
    </div>
  )
}

function UniversityCrest() {
  return (
    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full overflow-hidden border-2 border-[#c99700]">
      <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
        <path d="M12 2L2 6V8H22V6L12 2Z" fill="#0c2340" />
        <path d="M4 10V17C4 17 4 20 12 20C20 20 20 17 20 17V10" stroke="#0c2340" strokeWidth="2" fill="none" />
        <path d="M12 8V15M8 10V15M16 10V15" stroke="#c99700" strokeWidth="2" />
        <path d="M2 8H22" stroke="#c99700" strokeWidth="1" />
      </svg>
    </div>
  )
}
