import React from 'react';
import Section from './Section';
import Button from './ui/Button';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

import { API_BASE_URL } from '../lib/config';

const About: React.FC = () => {
  const [stats, setStats] = React.useState({
    students: 0,
    projects: 0,
    rating: 4.9,
  });
  const [showMission, setShowMission] = React.useState(false);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();

        setStats(prev => ({
          ...prev,
          students: data.users || 0,
          projects: data.projects || 0,
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Section id="about" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">About OURS</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
              We are a team of passionate developers dedicated to making high-quality coding education accessible to everyone. Our platform focuses on learning by doing, providing real-world projects and comprehensive courses.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Whether you are just starting out or looking to upgrade your skills, OURS has the resources you need to succeed in the tech industry.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setShowMission(true)}>
                Our Mission
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.students}+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.projects}+</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Projects</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.rating}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Average Rating</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Support</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission Modal */}
      {
        showMission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMission(false)}
            />
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all">
              <button
                onClick={() => setShowMission(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                  At OURS, our mission is to <strong>democratize technology education</strong>. We believe that everyone, regardless of their background or location, should have access to high-quality updates and resources to build their future in tech.
                </p>
                <p>
                  We strive to bridge the gap between theoretical knowledge and practical application by providing:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real-world project-based learning.</li>
                  <li>Affordable and accessible high-quality courses.</li>
                  <li>A supportive community of like-minded developers.</li>
                  <li>Tools and resources to accelerate career growth.</li>
                </ul>
                <p>
                  We are committed to fostering a culture of continuous learning and innovation, empowering the next generation of builders and creators.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowMission(false)}>Close</Button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default About;