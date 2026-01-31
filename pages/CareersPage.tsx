import React from 'react';
import { Terminal, Cpu, Shield, Zap, Code } from 'lucide-react';
import Button from '../components/ui/Button';

const CareersPage: React.FC = () => {
    const roles = [
        {
            title: "Full Stack Sorcerer",
            exp: "Level 50+",
            desc: "Must be able to conjure React components out of thin air and tame wild SQL queries.",
            stack: ["Next.js", "GraphQL", "Dark Magic"],
            icon: <Zap size={24} className="text-yellow-400" />
        },
        {
            title: "Bug Bounty Hunter",
            exp: "Any Level",
            desc: "Your mission, should you choose to accept it: Find the memory leaks before they find us.",
            stack: ["Debugger", "Coffee", "Patience"],
            icon: <Shield size={24} className="text-red-400" />
        },
        {
            title: "Pixel Perfectionist",
            exp: "Visionary",
            desc: "If you cry when a div is 1px off-center, we want you. Make our UI shine brighter than a supernova.",
            stack: ["Tailwind", "Framer Motion", "Figma"],
            icon: <Code size={24} className="text-blue-400" />
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-950 font-mono">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-primary to-tech-secondary">Resistance</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We don't hire employees. We recruit <span className="text-tech-accent font-bold">builders</span>.
                        Do you speak fluent binary? Can you center a div without Googling?
                    </p>
                    <div className="mt-8 p-4 bg-black/90 rounded-lg max-w-md mx-auto text-left font-mono text-sm shadow-2xl border border-gray-800">
                        <p className="text-green-400">$ whoami</p>
                        <p className="text-gray-300">future_teammate</p>
                        <p className="text-green-400">$ sudo join_team --force</p>
                        <p className="text-white animate-pulse">Scanning for skills... [OK]</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-tech-primary transition-all hover:shadow-lg group">
                            <div className="mb-4 bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                {role.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{role.title}</h3>
                            <p className="text-xs font-mono text-tech-primary mb-4">{role.exp}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-12">
                                {role.desc}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {role.stack.map(s => (
                                    <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-500">{s}</span>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full group-hover:bg-tech-primary group-hover:text-white group-hover:border-transparent">
                                Apply via Terminal
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-4">Don't see your role?</p>
                    <a href="mailto:careers@ours.com" className="text-tech-primary hover:underline font-bold text-lg">
                        Hack into our inbox anyway &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
