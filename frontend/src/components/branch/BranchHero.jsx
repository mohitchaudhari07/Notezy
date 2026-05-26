import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { ROUTES } from "../../utils/constants";

export default function BranchHero({ branch }) {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-4 text-xs text-gray-500">
          <Link to={ROUTES.HOME} className="hover:text-blue-600">
            Universities
          </Link>
          <span className="mx-2">›</span>
          <Link to={ROUTES.BRANCHES} className="hover:text-blue-600">
            {branch.university}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-400">{branch.semester}</span>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-700">{branch.name}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="primary">{branch.universityShort}</Badge>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Branch ID: {branch.branchId}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {branch.name}
            </h1>
            <p className="mt-3 text-gray-500">{branch.description}</p>
          </div>

          <Card className="flex shrink-0 divide-x divide-gray-100 p-0" padding={false}>
            {[
              { value: branch.stats.files, label: "Files" },
              { value: branch.stats.users, label: "Users" },
              { value: branch.stats.rating, label: "Rating", star: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-6 py-4 sm:px-8"
              >
                <p className="flex items-center gap-1 text-lg font-bold text-gray-900">
                  {stat.value}
                  {stat.star && (
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  )}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}
