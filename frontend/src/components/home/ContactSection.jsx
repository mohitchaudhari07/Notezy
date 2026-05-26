import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const subjects = [
  "General Inquiry",
  "Technical Support",
  "Partnership",
  "Representative Program",
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    // TODO: POST /api/contact when backend is ready
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: "", email: "", subject: subjects[0], message: "" });
  };

  return (
    <section id="contact" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-gray-500">
              Have questions about resources, partnerships, or our representative
              program? We&apos;d love to hear from you.
            </p>

            <ul className="mt-8 space-y-6">
              
              <li className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email us</p>
                  <a
                    href="Notezy@gmail.com"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Notezy@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call us</p>
                  <a
                    href="tel:+911800123456"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    +91 1800-123-456
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-xl bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900">
                Join our Representative Program
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Become a campus ambassador and help students access quality
                resources while earning rewards.
              </p>
              <a
                href="#"
                className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Learn More →
              </a>
            </div>
          </div>

          <Card className="shadow-md">
            {success ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-green-600">
                  Message sent successfully!
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => setSuccess(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                className="pl-3"
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Your name"
                />
                <Input
                  className="pl-3"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@university.edu"
                />
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-xs font-semibold text-gray-700"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-xs font-semibold text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>
                <Button type="submit" fullWidth isLoading={submitting}>
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
