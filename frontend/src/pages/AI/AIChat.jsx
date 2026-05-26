import Card from "../../components/ui/Card";

export default function AIChat() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">AI Study Assistant</h2>
      <Card className="mt-6 min-h-[400px]">
        <p className="text-gray-500">
          {/* TODO: integrate aiService chat endpoints */}
          AI chat interface will be connected to the backend.
        </p>
      </Card>
    </div>
  );
}
