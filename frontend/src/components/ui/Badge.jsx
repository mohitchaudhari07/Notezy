import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-blue-100 text-blue-700",
  secondary: "bg-gray-100 text-gray-600",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  pyq: "bg-blue-600 text-white",
  note: "bg-emerald-600 text-white",
};

export default function Badge({
  children,
  variant = "primary",
  className = "",
  size = "sm",
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-semibold uppercase tracking-wide",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
