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
      { label: 'Verify Certificate', href: '/verify' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-mono-50 dark:bg-mono-900 border-t border-mono-100 dark:border-mono-800 pt-16 pb-32 md:pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="OURS Logo" className="w-8 h-8 object-cover rounded-full" />
              <span className="text-xl font-semibold text-mono-950 dark:text-white">OURS.</span>
            </div>
            <p className="text-mono-500 dark:text-mono-400 text-sm leading-relaxed mb-6">
              The ultimate resource for developers to learn, build, and grow.
            </p>
            <div className="flex gap-4">
              <a
                href={socials?.twitter || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
              >
                <Twitter size={18} />
              </a>
              <a
                href={socials?.github || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
              >
                <Github size={18} />
              </a>
              <a
                href={socials?.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-mono-950 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-mono-500 dark:text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-mono-950 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-mono-500 dark:text-mono-400 hover:text-mono-950 dark:hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-mono-950 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-mono-500 dark:text-mono-400">
              <li>ours.system26@gmail.com</li>
              <li>+91 8005343226</li>
              <li>Everywhere in world</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-mono-100 dark:border-mono-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-mono-400">
            © 2026 OURS Inc. All rights reserved.
          </p>
          <p className="text-sm text-mono-400">
            Designed with care for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;