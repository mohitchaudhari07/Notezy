import RegisterForm from "../../components/forms/RegisterForm";
import TrustBadges from "../../components/auth/TrustBadges";

export default function Register() {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <RegisterForm />
      <TrustBadges />
    </div>
  );
}
