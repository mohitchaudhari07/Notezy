import { ChevronDown, FileText, SlidersHorizontal } from "lucide-react";
import { YEAR_TABS } from "../../utils/mockData";
import { cn } from "../../utils/cn";

export default function ResourceFilters({
  activeYear,
  onYearChange,
  itemCount,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {YEAR_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onYearChange(tab)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeYear === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Category
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Sort By
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">
          Available Resources{" "}
          <span className="font-normal text-gray-500">
            ({itemCount} items found)
          </span>
        </h2>
      </div>
    </div>
  );
}
