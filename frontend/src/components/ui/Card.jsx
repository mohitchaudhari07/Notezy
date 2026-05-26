import { cn } from "../../utils/cn";

export default function Card({
  children,
  className = "",
  padding = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm",
        padding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
