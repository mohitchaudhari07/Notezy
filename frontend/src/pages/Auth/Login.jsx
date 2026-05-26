import LoginForm from "../../components/forms/LoginForm";
import TrustBadges from "../../components/auth/TrustBadges";

export default function Login() {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <LoginForm />
      <TrustBadges />
    </div>
  );
}
