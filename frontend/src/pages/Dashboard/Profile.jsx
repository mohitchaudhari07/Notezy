import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";
import { studentService } from "../../services/studentService";
import { USER_KEY } from "../../utils/constants";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const updatedUser = await studentService.updateProfile({ name: form.name });
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      <p className="mt-1 text-gray-500">Manage your account details.</p>

      <Card className="mt-6">
        {message && (
          <p className="mb-4 text-sm text-green-600">{message}</p>
        )}
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            disabled
            onChange={() => {}}
          />
          <Button type="submit" isLoading={saving}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
