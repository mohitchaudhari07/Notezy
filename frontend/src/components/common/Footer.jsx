import { Globe, Mail, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { ROUTES } from "../../utils/constants";

const resourceLinks = [
  { label: "PYQs", to: ROUTES.BRANCHES },
  { label: "Notes", to: ROUTES.BRANCHES },
  { label: "University List", to: ROUTES.BRANCHES },
];

const companyLinks = [
  { label: "About Us", to: ROUTES.ABOUT },
  { label: "Contact", to: ROUTES.CONTACT },
  { label: "FAQ", to: `${ROUTES.HOME}#faq` },
];

const legalLinks = [
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
];

const socialIcons = [
  { Icon: Share2, label: "Twitter" },
  { Icon: MessageCircle, label: "Instagram" },
  { Icon: Globe, label: "LinkedIn" },
  { Icon: Mail, label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              Empowering engineering students with verified PYQs, study notes,
              and exam resources from top universities across India.
            </p>
            <div className="mt-4 flex gap-3">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Resources</h4>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2026 Notezy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
