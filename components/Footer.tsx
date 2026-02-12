import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Footer: React.FC = () => {
  const { socials } = useSite();

  const footerLinks = {
    platform: [
      { label: 'Courses', href: '/courses' },
      { label: 'Projects', href: '/projects' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Pricing', href: '/pricing' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-mono-950 relative overflow-hidden pt-24 pb-12 border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          {/* Brand - Span 4 */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/40 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img src="/logo.png" alt="OURS Logo" className="w-10 h-10 object-cover rounded-full relative z-10" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tighter">OURS<span className="text-neon-cyan">.</span></span>
              </Link>
              <p className="text-mono-400 leading-relaxed max-w-sm">
                Empowering the next generation of builders with premium resources, code, and mentorship.
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              {[
                { icon: Twitter, href: socials?.twitter },
                { icon: Github, href: socials?.github },
                { icon: Linkedin, href: socials?.linkedin },
                { icon: Instagram, href: '#' }
              ].map((Social, index) => (
                <a
                  key={index}
                  href={Social.href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-mono-400 hover:bg-neon-cyan hover:text-mono-950 transition-all duration-300 hover:-translate-y-1"
                >
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Span 8 */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm opacity-50">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-mono-400 hover:text-white transition-colors duration-200 text-base"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter / Contact Column */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm opacity-50">
                Contact
              </h4>
              <ul className="space-y-4 text-mono-400">
                <li className="hover:text-neon-cyan transition-colors cursor-pointer">ours.system26@gmail.com</li>
                <li className="hover:text-neon-cyan transition-colors cursor-pointer">+91 8005343226</li>
                <li>Global Remote 🌍</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Typography Bottom */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-sm text-mono-500">
            <p className="mb-2">© 2026 OURS Inc.</p>
            <div className="flex gap-4">
              <Link to="/terms" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
          <h2 className="text-[12vw] leading-none font-bold text-white/5 select-none pointer-events-none tracking-tighter mix-blend-overlay">
            OURS
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default Footer;