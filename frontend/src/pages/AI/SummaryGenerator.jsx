import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { aiService } from "../../services/aiService";

export default function SummaryGenerator() {
  const [resourceId, setResourceId] = useState("");
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    if (!resourceId.trim()) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const data = await aiService.getSummary(resourceId.trim());
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err.response?.data?.message || "Unable to load summary.");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!resourceId.trim()) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const data = await aiService.generateSummary(resourceId.trim());
      setSummary(null);
      setMessage(data?.aiStatus || "Summary generation started.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Summary Generator</h2>

      <Card className="mt-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <Input
            label="Resource ID"
            name="resourceId"
            placeholder="MongoDB resource id"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
          />
          <Button onClick={loadSummary} isLoading={loading} variant="secondary">
            Fetch
          </Button>
          <Button onClick={generateSummary} isLoading={loading}>
            Generate
          </Button>
        </div>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {summary && (
          <div className="mt-6 space-y-4 text-sm text-gray-700">
            <p>{summary.summaryText}</p>
            {summary.keyTakeaways?.length > 0 && (
              <ul className="list-disc space-y-1 pl-5">
                {summary.keyTakeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
