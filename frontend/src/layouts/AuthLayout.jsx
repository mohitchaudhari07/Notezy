import { Link, Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";
import { ROUTES } from "../utils/constants";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#F9FAFB]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-indigo-50/60 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="px-4 py-8 text-center sm:px-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            University Success, Simplified.
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Join 10,000+ students sharing premium PYQs and study notes.
          </p>
        </header>

        <div className="flex flex-1 items-start justify-center px-4 pb-8 sm:px-6">
          <Outlet />
        </div>

        <footer className="relative z-10 border-t border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Logo showText={false} to={null} />
              <span>© 2026 — The Student Learning Resource.</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-blue-600">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-600">
                Terms
              </a>
              <Link to={ROUTES.HOME} className="hover:text-blue-600">
                Sitemap
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
