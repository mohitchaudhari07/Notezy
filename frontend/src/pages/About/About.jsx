import { Link } from "react-router-dom";
import TeamSection from "../../components/home/TeamSection";
import StatsSection from "../../components/home/StatsSection";
import { ROUTES } from "../../utils/constants";

export default function About() {
  return (
    <div>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">About  <span className=" font-bold text-gray-800"> Note</span><span className="font-bold text-blue-600">zy</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            We&apos;re on a mission to make quality engineering education
            resources accessible to every student, regardless of their
            university or background.
          </p>
          <Link
            to={ROUTES.CONTACT}
            className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Get in touch →
          </Link>
        </div>
      </section>
      <StatsSection />
      <TeamSection />
    </div>
  );
}
