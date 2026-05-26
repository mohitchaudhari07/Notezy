import { GraduationCap, Shield, ShieldCheck } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Secure SSL", color: "text-blue-600 bg-blue-50" },
  {
    icon: GraduationCap,
    label: "Edu Verified",
    color: "text-green-600 bg-green-50",
  },
  { icon: Shield, label: "Safe Access", color: "text-purple-600 bg-purple-50" },
];

export default function TrustBadges() {
  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {badges.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">
        Need assistance?{" "}
        <a href="mailto:support@Notezy.com" className="font-medium text-blue-600 hover:text-blue-700">
          Contact Student Support
        </a>
      </p>
    </div>
  );
}
