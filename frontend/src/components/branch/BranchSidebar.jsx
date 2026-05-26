import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  POPULAR_SUBJECTS,
  TOP_CONTRIBUTORS,
} from "../../utils/mockData";
import { ROUTES } from "../../utils/constants";

export default function BranchSidebar() {
  return (
    <aside className="space-y-6">
      <Card className="bg-blue-50/50">
        <h3 className="text-sm font-bold text-gray-900">Top Contributors</h3>
        <ul className="mt-4 space-y-3">
          {TOP_CONTRIBUTORS.map((c, i) => (
            <li
              key={c.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium text-gray-700">
                <span className="mr-2 text-gray-400">{i + 1}.</span>
                {c.name}
              </span>
              <span className="text-gray-500">{c.count} files</span>
            </li>
          ))}
        </ul>
        <Link
          to={ROUTES.REGISTER}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Join Contributors List
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      <Card>
        <h3 className="text-sm font-bold text-gray-900">Popular Subjects</h3>
        <ul className="mt-4 space-y-3">
          {POPULAR_SUBJECTS.map((subject) => (
            <li
              key={subject.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{subject.name}</span>
              <Badge variant="secondary">{subject.count}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="bg-blue-600 text-white">
        <h3 className="text-lg font-bold">Request Papers</h3>
        <p className="mt-2 text-sm text-blue-100">
          Can&apos;t find what you need? Request specific PYQs or notes from our
          community.
        </p>
        <Button
          variant="secondary"
          className="mt-4 border-0 bg-white text-blue-600 hover:bg-blue-50"
          fullWidth
        >
          Request Now
        </Button>
      </Card>
    </aside>
  );
}
