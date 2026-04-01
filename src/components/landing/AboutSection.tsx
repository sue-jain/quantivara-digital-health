import { Camera, Network, User } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <Camera size={24} />,
    title: "AI That Reads What Doctors Write",
    description:
      "Point your phone at any prescription. In 30 seconds, Santhica's AI reads it, structures it, and stores it, handwritten, printed, messy or clean. No typing. No training. No internet required. Every capture feeds the network.",
  },
  {
    icon: <Network size={24} />,
    title: "The Data Network Is the Moat",
    description:
      "Every prescription digitized, every lab result bridged, every pharmacy connected, Santhica's AI doesn't just process data, it builds a network no one else can replicate. The more clinicians use it, the smarter and more valuable the platform becomes for everyone plugged in.",
  },
  {
    icon: <User size={24} />,
    title: "One Patient. One Record. Every Touchpoint.",
    description:
      "Prescriptions, X-rays, lab work, pharmacy history, Santhica's AI connects every data point into a living health record that follows the patient, not the clinic. Built to power the next generation of healthcare AI in India.",
  },
];

const differentiators = [
  "30 seconds to digitize a record",
  "Mobile-first — no laptop or desktop requirements",
  "No behavioral change expected from doctors/clinics",
];

export default function AboutSection() {
  return (
    <section id="about" className="relative">
      {/* Problem Statement — dark band */}
      <div className="bg-[#0d1220] py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="reveal text-xs font-semibold tracking-[0.2em] uppercase text-[#2db87f] mb-6">
            The Problem
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            10 billion prescriptions a year.
            <br />
            <span className="text-gray-500">Less than 0.1% are digitized.</span>
          </h2>

          {/* Stats row */}
          <div className="reveal reveal-delay-2 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2db87f] mb-2">3.9M</p>
              <p className="text-sm text-gray-400">care points across India</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2db87f] mb-2">70%</p>
              <p className="text-sm text-gray-400">travel 100km+ for care, carrying kilos of paper</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2db87f] mb-2">&lt;0.1%</p>
              <p className="text-sm text-gray-400">of 10B annual prescriptions are digitized</p>
            </div>
          </div>

          <p className="reveal reveal-delay-3 text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            India produces over 10 billion handwritten prescriptions annually. Fewer than 10 million
            ever make it into a digital system. Patient histories are fragmented across paper, clinics,
            and memory. Drug interactions go undetected. Care continuity breaks down, especially outside
            metro areas. 70% of patients travel over 100km for care — carrying kilos of paper records.
            No unified health data layer exists at scale.
          </p>
        </div>
      </div>

      {/* Product Image Section */}
      <div className="bg-gradient-to-b from-[#0d1220] to-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            <img
              src="/santhica-network.png"
              alt="Santhica Healthcare Ecosystem"
              className="w-full h-auto float"
            />
          </div>
        </div>
      </div>

      {/* What We Do — light section */}
      <div className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-xs font-semibold tracking-[0.2em] uppercase text-[#2db87f] text-center mb-4">
            What We Do
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl font-bold text-[#1e3a5f] text-center mb-6">
            The backbone everything else plugs into
          </h2>
          <p className="reveal reveal-delay-2 text-base text-gray-500 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            Every prescription digitized, every lab result bridged, every pharmacy
            connected, Santhica is building the data network India's healthcare
            system never had. Not another app. The backbone everything else plugs
            into.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((f, i) => (
              <div key={f.title} className={`reveal reveal-delay-${i + 1}`}>
                <FeatureCard {...f} />
              </div>
            ))}
          </div>

          {/* Key Differentiators */}
          <div className="reveal flex flex-wrap justify-center gap-4">
            {differentiators.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 text-sm text-[#1e3a5f] bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full font-medium"
              >
                <span className="w-1.5 h-1.5 bg-[#2db87f] rounded-full" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
