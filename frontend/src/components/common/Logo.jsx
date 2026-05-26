import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { cn } from "../../utils/cn";

export default function Logo({ className = "", showText = true, to = ROUTES.HOME }) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center">
        <img src="https://res.cloudinary.com/dqgfgmkkc/image/upload/v1779779571/twqvgosklhuhkgppijed.png" alt="" />
      </span>
      {showText && (
        <span className="text-xl font-bold text-gray-800">Note<span className="text-xl font-bold text-blue-600">zy</span></span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
