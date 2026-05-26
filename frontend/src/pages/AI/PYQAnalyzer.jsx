import Card from "../../components/ui/Card";

export default function PYQAnalyzer() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">PYQ Analyzer</h2>
      <Card className="mt-6">
        <p className="text-gray-500">
          {/* TODO: integrate PYQ analysis API */}
          Upload a PYQ to get AI-powered topic analysis and study recommendations.
        </p>
      </Card>
    </div>
  );
}
