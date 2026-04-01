import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  "Live AI demo — prescription to digital record in 30 seconds",
  "Works on mobile phone eliminating laptop and desktop",
  "Custom deployment plan for your organization",
];

export default function DemoSection() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;

    setSubmitting(true);

    const subject = encodeURIComponent(
      `Demo Request from ${form.name} — ${form.organization || "N/A"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization || "N/A"}\nRole: ${form.role}\nMessage: ${form.message || "N/A"}`
    );
    window.open(
      `mailto:support@santhica.com?subject=${subject}&body=${body}`,
      "_blank"
    );

    setSubmitting(false);
    setForm({ name: "", email: "", organization: "", role: "", message: "" });
    toast.success("Thanks! We'll be in touch within 24 hours.");
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2db87f]/40 focus:border-[#2db87f] transition-all";

  return (
    <section id="demo" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="reveal text-xs font-semibold tracking-[0.2em] uppercase text-[#2db87f] text-center mb-4">
          Get Started
        </p>
        <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl font-bold text-[#1e3a5f] text-center mb-16">
          Watch AI Read a Prescription in 30 Seconds
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Benefits */}
          <div className="reveal-left">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Get a personalized walkthrough of how our AI platform works for
              your hospital, clinic, or health system.
            </p>
            <ul className="space-y-5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-4">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-[#2db87f] rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-gray-600 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Form */}
          <form
            onSubmit={handleSubmit}
            className="reveal-right bg-gray-50 rounded-2xl p-8 border border-gray-100 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Dr. Priya Sharma"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="priya@hospital.org"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                Organization{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => update("organization", e.target.value)}
                placeholder="Apollo Hospitals"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Chief Medical Officer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                Message{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your use case..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2db87f] hover:bg-[#25a06e] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#2db87f]/20 hover:shadow-[#2db87f]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? "Sending..." : "Request a Demo"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
