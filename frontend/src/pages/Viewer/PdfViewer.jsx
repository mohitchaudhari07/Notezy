import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Card from "../../components/ui/Card";
import { resourceService } from "../../services/resourceService";
import { ROUTES } from "../../utils/constants";
import { normalizeResource } from "../../utils/resourceAdapter";

export default function PdfViewer() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadResource() {
      setLoading(true);
      setError("");
      try {
        const data = await resourceService.getResourceById(id);
        if (isMounted) {
          setResource(normalizeResource(data));
        }
      } catch (err) {
        if (isMounted) {
          setResource(null);
          setError(err.response?.data?.message || "Unable to open this document.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadResource();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={ROUTES.RESOURCE_DETAILS.replace(":id", id)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Back to resource
      </Link>

      <h1 className="mt-4 text-xl font-bold text-gray-900">
        {resource?.title || "Document viewer"}
      </h1>

      {error || !resource?.fileUrl ? (
        <div className="mt-6">
          <EmptyState
            title="Document unavailable"
            description={error || "The backend did not return a readable file URL."}
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden p-0" padding={false}>
          <iframe
            title={resource.title}
            src={resource.fileUrl}
            className="h-[75vh] w-full border-0"
          />
        </Card>
      )}
    </div>
  );
}
