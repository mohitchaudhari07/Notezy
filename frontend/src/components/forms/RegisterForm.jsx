import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }
    return next;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // AuthContext renders the backend error message.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg" padding>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create your Notezy account.
        </p>
      </div>

      {authError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="Alex Smith"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          leftIcon={<User className="h-4 w-4" />}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="demo@gmail.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<Lock className="h-4 w-4" />}
        />
        <Button type="submit" fullWidth size="lg" isLoading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
