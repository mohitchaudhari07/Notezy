import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";
import { studentService } from "../../services/studentService";
import { ROUTES } from "../../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedNotes: 0,
    downloads: 0,
    resources: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const [dashboard, savedNotes, downloads] = await Promise.all([
        studentService.getDashboard(),
        studentService.getSavedNotes().catch(() => []),
        studentService.getDownloads().catch(() => []),
      ]);

      if (isMounted) {
        setStats({
          savedNotes: Array.isArray(savedNotes) ? savedNotes.length : 0,
          downloads: Array.isArray(downloads) ? downloads.length : 0,
          resources: dashboard?.overview?.totalResources || 0,
        });
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Student"}!
        </h2>
        <p className="mt-1 text-gray-500">
          Track your saved notes, downloads, and exam progress.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Saved Notes" value={stats.savedNotes} />
        <StatsCard title="Downloads" value={stats.downloads} />
        <StatsCard title="Resources" value={stats.resources} />
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to={ROUTES.BRANCHES}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse Resources
          </Link>
          <Link
            to={ROUTES.SAVED_NOTES}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Saved Notes
          </Link>
          <Link
            to={ROUTES.AI_CHAT}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            AI Study Assistant
          </Link>
        </div>
      </Card>
    </div>
  );
}
