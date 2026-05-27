import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ROUTES } from "../../utils/constants";
import { Sparkles, BookOpen, ArrowRight, UserPlus, Info, CheckCircle2, Download, Brain } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-8  sm:py-8 border-b border-gray-100">
      {/* Decorative premium radial mesh gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-200/20 blur-[100px] sm:left-[5%]" />
        <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-emerald-100/20 blur-[120px] sm:right-[10%]" />
        <div className="absolute left-[30%] bottom-[-20%] h-[400px] w-[400px] rounded-full bg-purple-100/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Premium Value Proposition & Instructions */}
          <div className="space-y-8 lg:col-span-7">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>Trusted by 2500+ Engineering Students</span>
            </div>

            {/* Premium Typography Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Redefining How Engineering Students{" "}
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-650 to-emerald-500 bg-clip-text text-transparent drop-shadow-xs">
                Master Their Exams.
              </span>
            </h1>

            {/* Captivating description */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-500">
              Access verified Previous Year Question papers (PYQs), distinct syllabus patterns, and dynamic chapter notes from SPPU universities. Built for speed and acing your semester.
            </p>

            {/* Elegant Guest Access Instructions Card */}
            <div className="max-w-2xl rounded-2xl border border-indigo-100 bg-white/80 p-5 shadow-xs backdrop-blur-md relative overflow-hidden group hover:border-indigo-200 transition-all duration-300">
              <div className="absolute right-0 top-0 -mr-6 -mt-6 h-12 w-12 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-colors blur-md" />
              <div className="flex gap-3.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center border border-indigo-100">
                  <Info className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                    🚀 Free Guest Access Active
                  </span>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    You can search, view, and download any PDF question paper <strong className="text-indigo-600 font-semibold">100% free</strong> without signing in!
                  </p>
                  <p className="text-xs sm:text-sm text-indigo-600 font-bold flex items-center gap-1 mt-2.5">
                    ✨ Sign up to unlock Gemini AI summaries, saved subjects, personal bookmarks, and download tracking!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to={ROUTES.BRANCHES} className="group">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-0 hover:from-indigo-500 hover:to-indigo-700 shadow-md shadow-indigo-150 hover:-translate-y-0.5 transition-all duration-200"
                  leftIcon={<BookOpen className="h-4.5 w-4.5 shrink-0" />}
                  rightIcon={<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />}
                >
                  Explore PYQ Catalog
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
                  leftIcon={<UserPlus className="h-4.5 w-4.5 text-indigo-600 shrink-0" />}
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Mock Study Desk Card */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative rounded-2xl border border-indigo-100 bg-white p-6 shadow-xl overflow-hidden group hover:border-indigo-150 hover:shadow-2xl transition-all duration-500">
              {/* Background gradient orb inside mock card */}
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-50/50 blur-3xl group-hover:bg-indigo-50/80 transition-colors" />
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  SPPU PUNE UNIVERSITY
                </span>
              </div>

              {/* Card Title Info */}
              <div className="space-y-1 relative z-10">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5">
                  Computer Engineering &bull; SE
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-snug mt-2">
                  Data Structures & Algorithms
                </h3>
                <p className="text-xs text-slate-500 font-medium block">
                  Syllabus Pattern 2019 &bull; Second Year Semester 3
                </p>
              </div>

              {/* PYQ paper representation */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/40 p-4 relative z-10 space-y-3.5 hover:bg-slate-50/85 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">
                    INSEM EXAM 2024
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">March/April 2024</span>
                </div>
                
                {/* Feature checklist showing status */}
                <div className="grid gap-2.5 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Free PDF View & Download</span>
                    <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">FREE</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>Gemini AI Analysis & Key Formulas</span>
                    <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">SIGN UP</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>Bookmark and save to Student Dashboard</span>
                    <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">SIGN UP</span>
                  </div>
                </div>
              </div>

              {/* Actions demo bar */}
              <div className="mt-5 grid grid-cols-2 gap-2 relative z-10">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-50 transition cursor-default">
                  <Download className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>Free Download</span>
                </div>
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-2.5 text-center text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5 hover:bg-indigo-50/45 transition cursor-default">
                  <Brain className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>AI Study Summary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
