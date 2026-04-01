import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Request Demo", href: "#demo" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3"
        >
          <img
            src="/slide1_Picture 3.png"
            alt="Santhica"
            className={`h-12 w-auto transition-all duration-300 ${
              scrolled ? "" : "brightness-200"
            }`}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.label === "Request Demo" ? (
              <li key={link.href}>
                <button
                  onClick={() => handleClick(link.href)}
                  className="bg-[#2db87f] hover:bg-[#25a06e] text-white font-medium px-5 py-2 rounded-lg text-sm transition-all hover:-translate-y-0.5"
                >
                  {link.label}
                </button>
              </li>
            ) : (
              <li key={link.href}>
                <button
                  onClick={() => handleClick(link.href)}
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-[#1e3a5f] hover:text-[#2db87f]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            )
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition-colors ${
            scrolled ? "text-[#1e3a5f]" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="block w-full text-left text-sm font-medium text-[#1e3a5f] hover:text-[#2db87f]"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
