import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { resourceService } from "../../services/resourceService";
import { ROUTES } from "../../utils/constants";
import { GraduationCap, BookOpen, Layers } from "lucide-react";

export default function Branches() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    async function fetchCatalogData() {
      try {
        setLoading(true);
        setError("");
        const streamsList = await resourceService.getCatalogStreams();
        if (isMounted) {
          setStreams(streamsList);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load catalog streams:", err);
          setError("Failed to fetch available engineering streams. Please check your network connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCatalogData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 p-8 text-white shadow-xl sm:p-12">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            SPPU Pune University Catalog
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Engineering Stream Catalogs
          </h1>
          <p className="mt-4 text-lg text-indigo-200">
            Browse through verified syllabus streams. Select your branch to explore previous year question papers categorized by Year, Subject, and Exam session.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4">
          <Loader size="lg" />
          <p className="text-sm font-medium text-gray-500">Loading catalog streams...</p>
        </div>
      ) : error ? (
        <EmptyState 
          title="Catalog Loading Error" 
          description={error} 
          action={
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Savitribai Phule Pune University (SPPU)
            </h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((stream, idx) => {
              // Create dynamic branch ID shorthand (e.g. IT, COMP)
              const shorthand = stream.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 4);
              return (
                <Link
                  key={stream}
                  to={`/branches/sppu/${encodeURIComponent(stream)}`}
                  className="group"
                >
                  <Card className="h-full border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-150 hover:shadow-md group-hover:ring-1 group-hover:ring-indigo-100">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {shorthand}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Layers className="h-3.5 w-3.5" />
                        <span>B.E / B.Tech</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-650 transition-colors duration-200">
                      {stream}
                    </h3>
                    
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      Access complete unit question papers, in-semester and end-semester examinations.
                    </p>
                    
                    <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-semibold text-indigo-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        Explore Subjects
                      </span>
                      <span>&rarr;</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          to={ROUTES.HOME}
          className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200"
        >
          &larr; Back to Home Dashboard
        </Link>
      </div>
    </div>
  );
}
