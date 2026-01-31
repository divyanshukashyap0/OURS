import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Footer: React.FC = () => {
  const { socials } = useSite();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="OURS Logo" className="w-8 h-8 object-cover rounded-full" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">OURS.</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The ultimate resource for developers to learn, build, and grow. High quality courses and projects.
            </p>
            <div className="flex gap-4">
              {/* Socials from SiteContext or defaults */}
              <a href={socials?.twitter || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter size={20} /></a>
              <a href={socials?.github || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Github size={20} /></a>
              <a href={socials?.linkedin || "#"} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">Browse Courses</Link></li>
              <li><Link to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400">Projects</Link></li>
              <li><Link to="/tutorials" className="hover:text-blue-600 dark:hover:text-blue-400">Tutorials</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>support@ours.com</li>
              <li>+91 8005343226</li>
              <li>Kanpur, Uttar Pradesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 OURS Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <p>Designed with ❤️ for developers</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;