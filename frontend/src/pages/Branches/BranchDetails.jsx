import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { resourceService } from "../../services/resourceService";
import { aiService } from "../../services/aiService";
import { studentService } from "../../services/studentService";
import useAuth from "../../hooks/useAuth";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Download, 
  Sparkles, 
  HelpCircle, 
  CornerDownRight, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  X,
  Layers,
  Bookmark
} from "lucide-react";

export default function BranchDetails() {
  const { universitySlug, branchSlug } = useParams();
  const streamName = decodeURIComponent(branchSlug || "");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // If the branch is First Year, FE is the only valid year
  const isFirstYearBranch = streamName.toLowerCase() === "first year";
  const initialYear = isFirstYearBranch ? "FE" : "SE";

  const years = isFirstYearBranch
    ? [{ id: "FE", name: "First Year (FE)" }]
    : [
        { id: "SE", name: "Second Year (SE)" },
        { id: "TE", name: "Third Year (TE)" },
        { id: "BE", name: "Fourth Year (BE)" }
      ];

  const [activeYear, setActiveYear] = useState(initialYear);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [papersError, setPapersError] = useState("");

  // Ref for scrolling to papers list
  const papersSectionRef = useRef(null);

  // AI Summary State
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // Bookmarking State & Fetching
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setBookmarkedIds(new Set());
      return;
    }
    let isMounted = true;
    async function loadBookmarks() {
      try {
        const saved = await studentService.getSavedNotes();
        if (isMounted) {
          const ids = new Set((saved || []).map(item => item._id || item.id));
          setBookmarkedIds(ids);
        }
      } catch (err) {
        console.warn("Failed to load user bookmarks:", err);
      }
    }
    loadBookmarks();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Smooth scroll to papers section when a subject is clicked and papers load
  useEffect(() => {
    if (selectedSubject && papers.length > 0 && !loadingPapers) {
      const timer = setTimeout(() => {
        papersSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150); // Small delay to let the DOM settle
      return () => clearTimeout(timer);
    }
  }, [selectedSubject, papers, loadingPapers]);

  // Load Subjects when year or stream changes
  useEffect(() => {
    let isMounted = true;
    
    async function loadSubjects() {
      setLoadingSubjects(true);
      setSubjectsError("");
      setSelectedSubject(null);
      setPapers([]);
      try {
        const data = await resourceService.getCatalogSubjects(streamName, activeYear);
        if (isMounted) {
          setSubjects(data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load catalog subjects:", err);
          setSubjects([]);
          setSubjectsError("No subjects found in this Year section yet.");
        }
      } finally {
        if (isMounted) {
          setLoadingSubjects(false);
        }
      }
    }

    loadSubjects();
    return () => {
      isMounted = false;
    };
  }, [activeYear, streamName]);

  // Load Papers when subject is selected
  const handleSelectSubject = async (subjectName) => {
    setSelectedSubject(subjectName);
    setLoadingPapers(true);
    setPapersError("");
    setSelectedPaper(null);
    setAiSummary(null);
    try {
      const data = await resourceService.getCatalogPapers({
        branch: streamName,
        academicYear: activeYear,
        subject: subjectName
      });
      setPapers(data.papers || []);
    } catch (err) {
      console.error("Failed to load catalog papers:", err);
      setPapers([]);
      setPapersError("No question papers uploaded for this subject yet.");
    } finally {
      setLoadingPapers(false);
    }
  };

  // Fetch AI Summary
  const handleViewAiSummary = async (paper) => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    setSelectedPaper(paper);
    setLoadingSummary(true);
    setSummaryError("");
    setAiSummary(null);
    try {
      const data = await aiService.getSummary(paper._id);
      setAiSummary(data);
    } catch (err) {
      console.warn("AI summary not generated yet:", err.message);
      setSummaryError("No AI analysis summary generated for this paper yet. Would you like to generate it now?");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Trigger manual AI Summary Generation
  const handleGenerateSummary = async (paperId) => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    setLoadingSummary(true);
    setSummaryError("");
    try {
      await aiService.generateSummary(paperId);
      setSummaryError("AI pipeline enqueued! Analyzing PDF and generating detailed summary... Please wait a few seconds and try clicking 'View AI Summary' again.");
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setSummaryError("Failed to start AI analysis pipeline: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleToggleBookmark = async (paperId) => {
    if (!isAuthenticated) {
      const { ROUTES } = require ? { ROUTES: { LOGIN: "/auth/login" } } : {};
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    try {
      await studentService.bookmarkResource(paperId);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (next.has(paperId)) {
          next.delete(paperId);
        } else {
          next.add(paperId);
        }
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleDownload = async (paper) => {
    if (paper && paper.pdfUrl) {
      if (isAuthenticated) {
        try {
          await studentService.recordDownload(paper._id);
        } catch (e) {
          console.warn("Failed to record download history:", e);
        }
      }
      // Cloudinary attachment forcing download directly
      const downloadUrl = paper.pdfUrl.replace("/upload/", "/upload/fl_attachment/");
      window.open(downloadUrl, "_blank");
    }
  };

  const handleViewPdf = async (paper) => {
    if (paper && paper.pdfUrl) {
      if (isAuthenticated) {
        try {
          await studentService.recordDownload(paper._id);
        } catch (e) {
          console.warn("Failed to record view/download history:", e);
        }
      }
      window.open(paper.pdfUrl, "_blank");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/branches"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-650 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all Streams
        </Link>
      </div>

      {/* Stream Banner Header */}
      <div className="mb-10 rounded-2xl bg-slate-900 bg-cover bg-center p-8 text-white shadow-lg border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              {universitySlug?.toUpperCase() || "SPPU"} Pune University
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {streamName}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Explore previous year question papers cataloged by Year, Subject, and Exam Type. Click on subjects to browse years of INSEM and ENDSEM examinations.
            </p>
          </div>
          <div className="rounded-xl bg-slate-850 p-4 border border-slate-800 text-center min-w-44">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">University Code</span>
            <span className="text-2xl font-black text-indigo-400 block mt-1">SPPU-ENG</span>
          </div>
        </div>
      </div>

      {/* Year Selection Selector Bar */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px gap-2">
          {years.map((y) => {
            const isSelected = activeYear === y.id;
            const disabled = isFirstYearBranch && y.id !== "FE";
            if (disabled) return null;
            return (
              <button
                key={y.id}
                onClick={() => setActiveYear(y.id)}
                className={`border-b-2 px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {y.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Subjects and Papers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Available Subjects ({subjects.length})
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold border border-indigo-100">
              {years.find(y => y.id === activeYear)?.name}
            </span>
          </div>

          {loadingSubjects ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2">
              <Loader size="md" />
              <p className="text-xs font-medium text-gray-400">Loading subjects...</p>
            </div>
          ) : subjectsError ? (
            <EmptyState title="No Subjects Cataloged" description={subjectsError} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subj) => {
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => handleSelectSubject(subj)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                        : "border-gray-150 bg-white hover:border-indigo-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600">
                        {subj}
                      </h3>
                      <ChevronRight className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-indigo-605' : ''}`} />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Syllabus Papers Available</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Catalog Papers List for selected subject */}
          {selectedSubject && (
            <div ref={papersSectionRef} className="mt-8 border-t border-gray-100 pt-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CornerDownRight className="h-5 w-5 text-indigo-600 shrink-0" />
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  Papers for: <span className="text-indigo-600">{selectedSubject}</span>
                </h3>
              </div>

              {loadingPapers ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Loader size="md" />
                </div>
              ) : papersError ? (
                <EmptyState title="No papers found" description={papersError} />
              ) : papers.length === 0 ? (
                <EmptyState title="No papers found" description="No cataloged PDF papers found for this subject." />
              ) : (
                <div className="space-y-3">
                  {papers.map((paper) => {
                    const isPaperSelected = selectedPaper?._id === paper._id;
                    return (
                      <div
                        key={paper._id}
                        className={`p-4 rounded-xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isPaperSelected ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-150"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 max-w-full">
                          <div className={`p-2.5 rounded-lg shrink-0 ${(paper.examType === 'INSEM' || !paper.examType) ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-gray-400 tracking-wider block">
                              {paper.pattern || "2019 Pattern"} &bull; {paper.session || "March/Dec"}
                            </span>
                            <h4 className="font-bold text-gray-900 leading-snug mt-0.5 break-all">
                              {(paper.examType === 'ENDSEM' ? 'ENDSEM' : 'INSEM')} Exam - {paper.examYear}
                            </h4>
                          </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-600 font-bold shrink-0" />}
                            onClick={() => handleViewAiSummary(paper)}
                            className="bg-indigo-50/30 border-indigo-100 text-indigo-700 hover:bg-indigo-50 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-semibold truncate justify-center"
                          >
                            <span className="hidden sm:inline">AI </span>Summary
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                            onClick={() => handleViewPdf(paper)}
                            className="bg-emerald-50/30 border-emerald-100 text-emerald-700 hover:bg-emerald-50 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-semibold truncate justify-center"
                          >
                            View PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download className="h-3.5 w-3.5 shrink-0" />}
                            onClick={() => handleDownload(paper)}
                            className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-semibold truncate justify-center"
                          >
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Bookmark className={`h-3.5 w-3.5 shrink-0 ${bookmarkedIds.has(paper._id) ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />}
                            onClick={() => handleToggleBookmark(paper._id)}
                            className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-semibold truncate justify-center ${bookmarkedIds.has(paper._id) ? "bg-amber-50/30 border-amber-200 text-amber-700" : ""}`}
                          >
                            {bookmarkedIds.has(paper._id) ? "Saved" : "Save"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: AI Summary panel details */}
        <div>
          {/* Mobile Sliding Backdrop */}
          {selectedPaper && (
            <div 
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
              onClick={() => setSelectedPaper(null)}
            />
          )}

          {selectedPaper ? (
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl flex flex-col border-l border-gray-100 lg:static lg:w-auto lg:p-6 lg:shadow-none lg:bg-slate-50/50 lg:border lg:border-indigo-150 lg:rounded-2xl lg:sticky lg:top-6 lg:max-w-none lg:flex-none">
              <div className="flex items-start justify-between gap-2 mb-4 pb-4 border-b border-gray-200/60 shrink-0">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-indigo-650" />
                  <h3 className="font-bold text-gray-900">Google Gemini AI summary</h3>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200/50 rounded-lg transition shrink-0"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="mb-4 shrink-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Analyzed Resource</span>
                <span className="text-sm font-bold text-gray-900 mt-1 block">
                  {selectedPaper.examType} Exam ({selectedPaper.examYear}) - {selectedSubject}
                </span>
              </div>

              {loadingSummary ? (
                <div className="flex min-h-60 flex-col items-center justify-center gap-3 flex-1">
                  <Loader size="md" />
                  <p className="text-xs font-medium text-gray-400">Gemini is extracting formulas & takeaways...</p>
                </div>
              ) : summaryError ? (
                <div className="rounded-xl bg-amber-50/60 border border-amber-150 p-4 text-center flex-1 flex flex-col items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-amber-500 mx-auto mb-2 shrink-0" />
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    {summaryError}
                  </p>
                  {!summaryError.includes("enqueued") && (
                    <Button
                      size="sm"
                      className="mt-4 bg-indigo-650 hover:bg-indigo-720 text-white shrink-0"
                      leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                      onClick={() => handleGenerateSummary(selectedPaper._id)}
                    >
                      Generate AI Summary
                    </Button>
                  )}
                </div>
              ) : aiSummary ? (
                <div className="space-y-6 text-sm text-gray-600 leading-relaxed overflow-y-auto flex-1 pr-1 max-h-[calc(100vh-180px)] lg:max-h-[500px]">
                  {/* Summary Text Paragraph */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">General Focus</span>
                    <p className="text-gray-700 bg-white p-3.5 rounded-xl border border-gray-150 leading-relaxed">
                      {aiSummary.summaryText}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  {aiSummary.keyTakeaways && aiSummary.keyTakeaways.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Key Concepts & Themes
                      </span>
                      <ul className="space-y-2">
                        {aiSummary.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="flex gap-2 items-start text-gray-700">
                            <span className="text-indigo-600 font-bold mt-0.5">&bull;</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chapter weight analysis */}
                  {aiSummary.chapters && aiSummary.chapters.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Topic Weights</span>
                      <div className="space-y-2">
                        {aiSummary.chapters.map((chap, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between gap-4 shadow-2xs">
                            <div className="min-w-0">
                              <h5 className="font-bold text-gray-900 truncate">{chap.title}</h5>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{chap.topics?.join(', ')}</p>
                            </div>
                            <Badge 
                              className={`shrink-0 ${
                                chap.importance === 'High' 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                  : chap.importance === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}
                            >
                              {chap.importance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Formulas */}
                  {aiSummary.keyFormulas && aiSummary.keyFormulas.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Key Formulas & Rules</span>
                      <div className="space-y-2.5">
                        {aiSummary.keyFormulas.map((form, index) => (
                          <div key={index} className="bg-indigo-50/20 border border-indigo-100/50 p-3 rounded-xl">
                            <code className="font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded-md border border-indigo-50/60 block text-center mb-1 text-xs">
                              {form.formula}
                            </code>
                            <p className="text-xs text-gray-500 mt-1">{form.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/20 sticky top-6 hidden lg:block">
              <BrainCircuit className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700">AI Study Desk</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-64 mx-auto leading-relaxed">
                Click the 'AI Summary' button on any question paper to load Google Gemini key formulas, chapter weights, and syllabus notes dynamically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
