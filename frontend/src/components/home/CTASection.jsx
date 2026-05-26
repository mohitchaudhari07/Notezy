import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ROUTES } from "../../utils/constants";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blue-600 px-8 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Ace Your Next Semester?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Join thousands of engineering students accessing verified PYQs and
            study materials from top universities.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button
                variant="secondary"
                size="lg"
                className="border-0 bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link
              to={ROUTES.BRANCHES}
              className="text-sm font-semibold text-white hover:text-blue-100"
            >
              View our Courses →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
