import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import ResourceCard from "../../components/resource/ResourceCard";
import { studentService } from "../../services/studentService";
import { ROUTES } from "../../utils/constants";
import { normalizeResourceList } from "../../utils/resourceAdapter";

export default function SavedNotes() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSavedNotes() {
      setLoading(true);
      setError("");
      try {
        const data = await studentService.getSavedNotes();
        if (isMounted) {
          setResources(normalizeResourceList(data));
        }
      } catch (err) {
        if (isMounted) {
          setResources([]);
          setError(err.response?.data?.message || "Unable to load saved notes.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSavedNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Saved Notes</h2>
      <p className="mt-1 text-gray-500">Your bookmarked study materials.</p>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="mt-8">
          <EmptyState title="Saved notes unavailable" description={error} />
        </div>
      ) : resources.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No saved notes yet"
            description="Bookmark resources while browsing to see them here."
            action={
              <Link
                to={ROUTES.BRANCHES}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Browse branches
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
