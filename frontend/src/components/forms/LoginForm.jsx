import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

function validateEmail(email) {
  if (!email.trim()) return "University email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address";
  }
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch {
      // AuthContext renders the backend error message.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg" padding>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in with your Notezy account.
        </p>
      </div>

      {authError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="demo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <Button type="submit" fullWidth size="lg" isLoading={submitting}>
          Sign In to Notezy
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-4 text-center">
        <Link
          to={ROUTES.HOME}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Continue as Guest
        </Link>
      </div>
    </Card>
  );
}
