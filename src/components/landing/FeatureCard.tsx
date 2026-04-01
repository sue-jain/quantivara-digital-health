import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2db87f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#2db87f]/5 hover:-translate-y-1">
      <div className="w-12 h-12 bg-gradient-to-br from-[#2db87f]/10 to-[#1e3a5f]/10 rounded-xl flex items-center justify-center text-[#2db87f] mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1e3a5f] mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
