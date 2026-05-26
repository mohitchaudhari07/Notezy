import { FileText, BookOpen, GraduationCap, Users } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "3000+",
    label: "Question Papers",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Subjects",
  },
  {
    icon: GraduationCap,
    value: "10+",
    label: "Engineering Branches",
  },
  {
    icon: Users,
    value: "100%",
    label: "Student Focused",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl bg-blue-50/80 px-4 py-8 text-center"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
