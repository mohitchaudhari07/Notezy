import { Menu, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/common/Logo";
import Button from "../components/ui/Button";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import { cn } from "../utils/cn";

const sidebarLinks = [
  { label: "Overview", to: ROUTES.DASHBOARD },
  { label: "Saved Notes", to: ROUTES.SAVED_NOTES },
  { label: "Downloads", to: ROUTES.DOWNLOADS },
  { label: "Profile", to: ROUTES.PROFILE },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const linkClass = ({ isActive }) =>
    cn(
      "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <Logo />
          <button
            type="button"
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <p className="truncate text-sm font-medium text-gray-900">
            {user?.name || user?.email || "Student"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start px-0"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
