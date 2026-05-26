import { cn } from "../../utils/cn";

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export default function Loader({ size = "md", className = "" }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-blue-600 border-t-transparent",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
