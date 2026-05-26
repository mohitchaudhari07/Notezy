import { Bookmark, Download, Eye, Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useAuth from "../../hooks/useAuth";
import { resourceService } from "../../services/resourceService";
import { ROUTES } from "../../utils/constants";
import { normalizeResource } from "../../utils/resourceAdapter";

export default function ResourceCard({ resource }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const item = normalizeResource(resource);
  const typeVariant = item.type === "PYQ" ? "pyq" : "note";

  const requireAuth = () => {
    if (isAuthenticated) return true;
    navigate(ROUTES.LOGIN, { state: { from: location } });
    return false;
  };

  const handleBookmark = async () => {
    if (!requireAuth()) return;
    if (!item.id || bookmarking) return;
    setBookmarking(true);
    try {
      await resourceService.bookmarkResource(item.id);
    } catch {
      // API interceptor handles unauthorized sessions.
    } finally {
      setBookmarking(false);
    }
  };

  const handleDownload = async () => {
    if (!requireAuth()) return;
    if (!item.id || downloading) return;
    setDownloading(true);
    try {
      const data = await resourceService.downloadResource(item.id);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      // API interceptor handles unauthorized sessions.
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md" padding>
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant={typeVariant} size="md">
          {item.type}
        </Badge>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {item.rating}
        </span>
      </div>

      <h3 className="mb-3 line-clamp-2 flex-1 text-sm font-bold text-gray-900">
        {item.title}
      </h3>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
          {item.subjectCode}
        </span>
        <span>{item.year}</span>
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {item.views}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            if (item.onModel === 'QuestionPaper' || item.type === 'PYQ') {
              window.open(item.fileUrl, "_blank");
            } else {
              navigate(ROUTES.RESOURCE_DETAILS.replace(":id", item.id));
            }
          }}
        >
          View
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Bookmark"
          isLoading={bookmarking}
          onClick={handleBookmark}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          className="flex-1"
          leftIcon={<Download className="h-4 w-4" />}
          isLoading={downloading}
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
    </Card>
  );
}
