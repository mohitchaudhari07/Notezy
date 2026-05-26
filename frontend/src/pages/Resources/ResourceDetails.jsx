import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Star } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { resourceService } from "../../services/resourceService";
import { ROUTES } from "../../utils/constants";
import { normalizeResource } from "../../utils/resourceAdapter";

export default function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
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
          setError(err.response?.data?.message || "Unable to load this resource.");
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

  const handleDownload = async () => {
    if (!resource?.id || downloading) return;
    setDownloading(true);
    try {
      const data = await resourceService.downloadResource(resource.id);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Resource unavailable"
          description={error || "This resource could not be found."}
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
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to={ROUTES.BRANCHES} className="text-sm text-blue-600 hover:text-blue-700">
        Back to resources
      </Link>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={resource.type === "PYQ" ? "pyq" : "note"} size="md">
            {resource.type}
          </Badge>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {resource.rating}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {resource.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Subject: {resource.subjectCode}</span>
          <span>Year: {resource.year}</span>
          {resource.semester && <span>Semester: {resource.semester}</span>}
          <span>Views: {resource.views}</span>
        </div>

        <p className="mt-6 text-gray-600">
          {resource.subjectName && resource.branchName
            ? `${resource.subjectName} material for ${resource.branchName}.`
            : "Use the viewer to read the document online or download it for offline study."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={ROUTES.PDF_VIEWER.replace(":id", resource.id)}>
            <Button variant="outline">View Online</Button>
          </Link>
          <Button
            leftIcon={<Download className="h-4 w-4" />}
            isLoading={downloading}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </Card>
    </div>
  );
}
