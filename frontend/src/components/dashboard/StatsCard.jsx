import Card from "../ui/Card";

export default function StatsCard({ title, value, subtitle }) {
  return (
    <Card>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </Card>
  );
}
