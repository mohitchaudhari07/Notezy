import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { resourceService } from "../../services/resourceService";
import { aiService } from "../../services/aiService";
import { studentService } from "../../services/studentService";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { 
  Search, 
  FileText, 
  Download, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Layers,
  BrainCircuit,
  X,
  TrendingUp,
  HelpCircle,
  Bookmark
} from "lucide-react";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState("");

  // AI Summary Panel States
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

  useEffect(() => {
    let isMounted = true;

    async function search() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setSelectedPaper(null);
      setAiSummary(null);
      try {
        const data = await resourceService.searchResources(query, { limit: 50 });
        if (isMounted) {
          setResults(data.papers || []);
        }
      } catch (err) {
        if (isMounted) {
          setResults([]);
          setError(err.response?.data?.message || "Unable to complete search at this time.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    search();

    return () => {
      isMounted = false;
    };
  }, [query]);

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Search className="h-7 w-7 text-indigo-600" />
          Search Results
          {query && (
            <span className="font-normal text-gray-500"> for &quot;{query}&quot;</span>
          )}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          We matched your keyword against 3,000+ course titles, subjects, syllabus patterns, and PDF files.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3">
          <Loader size="lg" />
          <p className="text-sm font-medium text-gray-500">Searching the database...</p>
        </div>
      ) : error ? (
        <EmptyState title="Search Service Failure" description={error} />
      ) : results.length > 0 ? (
        /* Main Search Layout splits screen if an AI Summary is active */
        <div className="grid gap-8 lg:grid-cols-[1fr_385px]">
          {/* Left Column: Papers List */}
          <div className="space-y-4">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Found {results.length} Matching Question Papers
            </div>
            
            <div className="space-y-3.5">
              {results.map((paper) => {
                const isPaperSelected = selectedPaper?._id === paper._id;
                // Safely format FE subjects stored in pattern field
                const displaySubject = paper.branch === 'First Year' ? paper.pattern : paper.subject;
                const displayYear = paper.academicYear === 'First Year' ? 'FE' : paper.academicYear;
                
                return (
                  <div
                    key={paper._id}
                    className={`p-5 rounded-xl border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-xs ${
                      isPaperSelected ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-150"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 max-w-full">
                      <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${(paper.examType === 'INSEM' || !paper.examType) ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5 uppercase tracking-wide">
                            {paper.university}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {paper.branch} &bull; Year {displayYear}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-gray-900 leading-snug mt-1.5 text-base">
                          {displaySubject}
                        </h4>
                        <span className="text-xs font-semibold text-gray-400 block mt-1">
                          {(paper.examType === 'ENDSEM' ? 'ENDSEM' : 'INSEM')} Exam ({paper.examYear}) &bull; Pattern {paper.pattern || "2019"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 md:w-auto md:flex md:flex-wrap md:items-center md:gap-2 shrink-0 border-t border-gray-50 pt-3 md:border-0 md:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-600 font-bold shrink-0" />}
                        onClick={() => handleViewAiSummary(paper)}
                        className="bg-indigo-50/30 border-indigo-100 text-indigo-700 hover:bg-indigo-50 px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm font-semibold truncate justify-center"
                      >
                        <span className="hidden sm:inline">AI </span>Summary
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                        onClick={() => handleViewPdf(paper)}
                        className="bg-emerald-50/30 border-emerald-100 text-emerald-700 hover:bg-emerald-50 px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm font-semibold truncate justify-center"
                      >
                        View PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download className="h-3.5 w-3.5 shrink-0" />}
                        onClick={() => handleDownload(paper)}
                        className="px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm font-semibold truncate justify-center"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Bookmark className={`h-3.5 w-3.5 shrink-0 ${bookmarkedIds.has(paper._id) ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />}
                        onClick={() => handleToggleBookmark(paper._id)}
                        className={`px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm font-semibold truncate justify-center ${bookmarkedIds.has(paper._id) ? "bg-amber-50/30 border-amber-200 text-amber-700" : ""}`}
                      >
                        {bookmarkedIds.has(paper._id) ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: AI Summary Panel */}
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
                    <BrainCircuit className="h-5 w-5 text-indigo-655" />
                    <h3 className="font-bold text-gray-900">Google Gemini AI summary</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPaper(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200/50 rounded-lg transition shrink-0"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="mb-4 shrink-0 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Analyzed Subject</span>
                  <span className="font-extrabold text-gray-900 mt-1 block text-sm leading-snug">
                    {selectedPaper.branch === 'First Year' ? selectedPaper.pattern : selectedPaper.subject}
                  </span>
                  <span className="text-gray-500 font-semibold block mt-1.5">
                    {(selectedPaper.examType === 'ENDSEM' ? 'ENDSEM' : 'INSEM')} Exam - {selectedPaper.examYear}
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
                    {/* Summary text */}
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

                    {/* Topic weights */}
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

                    {/* Key formulas */}
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
      ) : (
        <div className="mt-8">
          <EmptyState
            title={query ? "No results found" : "Search resources"}
            description={
              query
                ? "Try a different keyword (e.g. Mathematics, Big Data, Electrical, 2024, etc.) or explore by stream catalog."
                : "Use the search bar to find PYQs, notes, and syllabus files."
            }
            action={
              <Link
                to={ROUTES.BRANCHES}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-650 hover:text-indigo-720 transition"
              >
                Browse Engineering Streams
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
