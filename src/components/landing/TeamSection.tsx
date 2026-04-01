import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  bio: string;
  linkedin?: string;
}

const team: TeamMember[] = [
  {
    name: "Suranjana Roy",
    initials: "SR",
    role: "Founder & CEO",
    bio: "Former Head of Engineering at Amazon. Led Agentic AI, LLM, Inferencing, and MLOps for Alexa and AGI. 15+ years building AI systems at Amazon, Oracle, and now Santhica.",
    linkedin: "https://www.linkedin.com/in/sbroy/",
  },
  {
    name: "Soubhagini Mahapatra",
    initials: "SM",
    role: "CTO & Founding Engineer",
    bio: "Ex-HubSpot Senior Engineer. 14+ years building distributed systems at scale. Building Santhica's core infrastructure: offline-first mobile, cloud sync, and consent-driven data flows.",
    linkedin: "https://www.linkedin.com/in/soubhagini-mahapatra-978035156/",
  },
  {
    name: "Romir Jain",
    initials: "RJ",
    role: "COO & Founding Engineer",
    bio: "Recent CS grad, serial entrepreneur. Brings startup velocity and AI product experience to the founding team.",
  },
];

const companies = ["Amazon", "Alexa", "Audible", "Oracle", "HubSpot", "Broadcom"];

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="reveal text-xs font-semibold tracking-[0.2em] uppercase text-[#2db87f] text-center mb-4">
          Leadership
        </p>
        <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl font-bold text-[#1e3a5f] text-center mb-4">
          Our Team
        </h2>
        <p className="reveal reveal-delay-2 text-gray-500 text-center max-w-2xl mx-auto mb-16">
          US-based leadership bringing Silicon Valley engineering standards to
          India's most complex domestic problem.
        </p>

        {/* Team Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`reveal reveal-delay-${i + 1} group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2db87f]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center`}
            >
              {/* Placeholder initials */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a5f] to-[#2db87f] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5 group-hover:scale-105 transition-transform duration-300">
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-[#1e3a5f]">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-[#2db87f] mb-4">
                {member.role}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {member.bio}
              </p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#0a66c2] hover:underline"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Company Logo Strip */}
        <div className="reveal flex flex-wrap justify-center items-center gap-8">
          {companies.map((c) => (
            <span
              key={c}
              className="text-sm tracking-wider uppercase text-gray-300 font-semibold"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
