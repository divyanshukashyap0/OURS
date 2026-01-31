import React from 'react';
import { Code2, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
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
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Browse Courses</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Projects</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Tutorials</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>support@ours.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 OURS Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Admin Dashboard</a>
            <p>Designed with ❤️ for developers</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;