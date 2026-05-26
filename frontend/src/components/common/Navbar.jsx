import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { cn } from "../../utils/cn";

const navLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "PYQs", to: ROUTES.BRANCHES },
  { label: "About Us", to: ROUTES.ABOUT },
  { label: "Contact", to: ROUTES.CONTACT },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors",
      isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <SearchBar />
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <SearchBar className="mb-4 max-w-none" />
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4">
              {isAuthenticated ? (
                <Button fullWidth onClick={() => navigate(ROUTES.DASHBOARD)}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="secondary" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                    Log in
                  </Button>
                  <Button fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
