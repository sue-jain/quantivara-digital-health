import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  const scrollToDemo = () => {
    document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0f1a]">
      {/* Background network image */}
      <div className="absolute inset-0">
        <img
          src="/santhica-hero-network.png"
          alt=""
          className="w-full h-full object-cover opacity-70"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/60 via-transparent to-[#0a0f1a]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/40 via-transparent to-[#0a0f1a]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24">
        {/* Tagline chip */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-[#2db87f] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">
            India's Healthcare Data Backbone
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-4 leading-[1.05]">
          Santhica
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[#2db87f] mb-8">
          Care That Connects
        </p>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Not another health app. The data backbone India's 1.4 billion people
          have been waiting for.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={scrollToDemo}
            className="bg-[#2db87f] hover:bg-[#25a06e] text-white font-semibold px-8 py-4 rounded-lg text-base transition-all shadow-lg shadow-[#2db87f]/20 hover:shadow-[#2db87f]/40 hover:-translate-y-0.5"
          >
            Request a Demo
          </button>
          <button
            onClick={scrollToAbout}
            className="text-gray-400 hover:text-white border border-white/20 hover:border-white/40 font-medium px-8 py-4 rounded-lg text-base transition-all"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollToAbout}
          className="text-gray-500 hover:text-white transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
