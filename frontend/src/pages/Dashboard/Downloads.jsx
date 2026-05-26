import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Card from "../../components/ui/Card";
import { studentService } from "../../services/studentService";
import { ROUTES } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";
import { normalizeResource } from "../../utils/resourceAdapter";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDownloads() {
      setLoading(true);
      setError("");
      try {
        const data = await studentService.getDownloads();
        if (isMounted) {
          setDownloads(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setDownloads([]);
          setError(err.response?.data?.message || "Unable to load downloads.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDownloads();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Downloads</h2>
      <p className="mt-1 text-gray-500">Your download history.</p>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="mt-8">
          <EmptyState title="Downloads unavailable" description={error} />
        </div>
      ) : downloads.length > 0 ? (
        <div className="mt-8 space-y-3">
          {downloads.map((download) => {
            const resource = normalizeResource(download.resource);
            return (
              <Card key={download._id || `${resource.id}-${download.createdAt}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {resource.type} | {resource.year} |{" "}
                      {formatDate(download.createdAt)}
                    </p>
                  </div>
                  <Link
                    to={ROUTES.RESOURCE_DETAILS.replace(":id", resource.id)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View resource
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No downloads yet"
            description="Downloaded resources will appear here."
          />
        </div>
      )}
    </div>
  );
}
