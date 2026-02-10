import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Send, Code, Clock, ShieldCheck, Mail,
    Target, Users, Layers, Database, Smartphone, Globe,
    CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import LogoLoader from '../components/ui/LogoLoader';

const RequestProjectPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentSection, setCurrentSection] = useState(1);

    const formRef = React.useRef<HTMLFormElement>(null);

    // Comprehensive SRS Form State
    const [formData, setFormData] = useState({
        // Section 1: Project Overview
        projectName: '',
        projectType: 'web-app',
        contactEmail: currentUser?.email || '',
        contactPhone: '',
        companyName: '',

        // Section 2: Problem & Objectives
        problemStatement: '',
        projectObjectives: '',
        successCriteria: '',

        // Section 3: Scope & Features
        inScopeFeatures: '',
        outOfScopeFeatures: '',
        mvpFeatures: '',
        futureEnhancements: '',

        // Section 4: Technical Requirements
        techStack: 'any',
        platformRequirements: [] as string[],
        integrations: '',
        performanceRequirements: '',
        securityRequirements: '',

        // Section 5: User Requirements
        targetAudience: '',
        userRoles: '',
        userFlows: '',

        // Section 6: Constraints & Dependencies
        budget: '20-50',
        timeline: 'flexible',
        constraints: '',
        dependencies: '',

        // Section 7: Additional Info
        designReferences: '',
        additionalNotes: '',
        priority: 'standard'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        const arr = formData[name as keyof typeof formData] as string[];
        if (checked) {
            setFormData({ ...formData, [name]: [...arr, value] });
        } else {
            setFormData({ ...formData, [name]: arr.filter(v => v !== value) });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'project_requests'), {
                ...formData,
                platformRequirements: formData.platformRequirements.join(', '),
                userId: currentUser?.uid || 'anonymous',
                createdAt: serverTimestamp(),
                status: 'pending'
            });

            if (formRef.current) {
                formRef.current.submit();
            }
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Connection interrupted. Please try again.");
            setLoading(false);
        }
    };

    const sections = [
        { id: 1, title: 'Overview', icon: FileText },
        { id: 2, title: 'Problem & Goals', icon: Target },
        { id: 3, title: 'Scope & Features', icon: Layers },
        { id: 4, title: 'Technical', icon: Database },
        { id: 5, title: 'Users', icon: Users },
        { id: 6, title: 'Constraints', icon: AlertTriangle },
        { id: 7, title: 'Submit', icon: Send },
    ];

    const inputClass = "w-full bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-xl px-4 py-3 text-mono-950 dark:text-white focus:border-mono-950 dark:focus:border-white focus:ring-1 focus:ring-mono-950 dark:focus:ring-white outline-none transition-all placeholder:text-mono-400";
    const labelClass = "block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2";
    const sectionClass = "bg-white dark:bg-mono-900 border border-mono-100 dark:border-mono-800 rounded-2xl p-6 md:p-8 space-y-6";

    return (
        <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-white font-sans">
            <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">

                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 text-mono-500 hover:text-mono-950 dark:hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-mono-950 dark:bg-white rounded-2xl flex items-center justify-center shrink-0">
                            <FileText size={28} className="text-white dark:text-mono-950" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Software Requirements Specification
                            </h1>
                            <p className="text-mono-500 dark:text-mono-400">
                                Complete this detailed form to help us understand your project requirements.
                            </p>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-mono-800 p-4 rounded-xl border border-mono-100 dark:border-mono-700 flex items-center gap-3">
                            <Clock className="text-mono-600 dark:text-mono-400" size={20} />
                            <div>
                                <h3 className="font-semibold text-sm">7-Day Sprint</h3>
                                <p className="text-xs text-mono-500">Rapid development</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-mono-800 p-4 rounded-xl border border-mono-100 dark:border-mono-700 flex items-center gap-3">
                            <ShieldCheck className="text-mono-600 dark:text-mono-400" size={20} />
                            <div>
                                <h3 className="font-semibold text-sm">Full Ownership</h3>
                                <p className="text-xs text-mono-500">100% source code</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-mono-800 p-4 rounded-xl border border-mono-100 dark:border-mono-700 flex items-center gap-3">
                            <Mail className="text-mono-600 dark:text-mono-400" size={20} />
                            <div>
                                <h3 className="font-semibold text-sm">Direct Support</h3>
                                <p className="text-xs text-mono-500">Engineering contact</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Navigation */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex gap-2 min-w-max">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setCurrentSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentSection === section.id
                                    ? 'bg-mono-950 dark:bg-white text-white dark:text-mono-950'
                                    : 'bg-white dark:bg-mono-800 text-mono-600 dark:text-mono-400 border border-mono-200 dark:border-mono-700 hover:border-mono-400'
                                    }`}
                            >
                                <section.icon size={16} />
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <form
                        ref={formRef}
                        action="https://formsubmit.co/ours.system26@gmail.com"
                        method="POST"
                        onSubmit={handleSubmit}
                    >
                        {/* Hidden Configuration for FormSubmit */}
                        <input type="hidden" name="_subject" value={`[SRS] ${formData.projectName} - ${formData.priority.toUpperCase()}`} />
                        <input type="hidden" name="_template" value="table" />
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_next" value="https://ours2026.vercel.app/" />

                        {/* Hidden inputs to ensure ALL data is sent to FormSubmit */}
                        <input type="hidden" name="Project Name" value={formData.projectName} />
                        <input type="hidden" name="Project Type" value={formData.projectType} />
                        <input type="hidden" name="Contact Email" value={formData.contactEmail} />
                        <input type="hidden" name="Contact Phone" value={formData.contactPhone} />
                        <input type="hidden" name="Company Name" value={formData.companyName} />
                        <input type="hidden" name="Problem Statement" value={formData.problemStatement} />
                        <input type="hidden" name="Project Objectives" value={formData.projectObjectives} />
                        <input type="hidden" name="Success Criteria" value={formData.successCriteria} />
                        <input type="hidden" name="In-Scope Features" value={formData.inScopeFeatures} />
                        <input type="hidden" name="MVP Features" value={formData.mvpFeatures} />
                        <input type="hidden" name="Out of Scope" value={formData.outOfScopeFeatures} />
                        <input type="hidden" name="Future Enhancements" value={formData.futureEnhancements} />
                        <input type="hidden" name="Tech Stack" value={formData.techStack} />
                        <input type="hidden" name="Platform Requirements" value={formData.platformRequirements.join(', ')} />
                        <input type="hidden" name="Integrations" value={formData.integrations} />
                        <input type="hidden" name="Performance Requirements" value={formData.performanceRequirements} />
                        <input type="hidden" name="Security Requirements" value={formData.securityRequirements} />
                        <input type="hidden" name="Target Audience" value={formData.targetAudience} />
                        <input type="hidden" name="User Roles" value={formData.userRoles} />
                        <input type="hidden" name="User Flows" value={formData.userFlows} />
                        <input type="hidden" name="Budget" value={formData.budget} />
                        <input type="hidden" name="Timeline" value={formData.timeline} />
                        <input type="hidden" name="Constraints" value={formData.constraints} />
                        <input type="hidden" name="Dependencies" value={formData.dependencies} />
                        <input type="hidden" name="Design References" value={formData.designReferences} />
                        <input type="hidden" name="Additional Notes" value={formData.additionalNotes} />
                        <input type="hidden" name="Priority" value={formData.priority} />

                        {/* Section 1: Project Overview */}
                        {currentSection === 1 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">1</span>
                                    <h2 className="text-xl font-bold">Project Overview</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Project Name / Codename *</label>
                                        <input type="text" name="projectName" required className={inputClass}
                                            placeholder="e.g. Project Orion, TaskMaster Pro"
                                            value={formData.projectName} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Project Type *</label>
                                        <select name="projectType" className={inputClass} value={formData.projectType} onChange={handleChange}>
                                            <option value="web-app">Web Application</option>
                                            <option value="mobile-app">Mobile Application</option>
                                            <option value="desktop-app">Desktop Application</option>
                                            <option value="api-backend">API / Backend Service</option>
                                            <option value="landing-page">Landing Page / Website</option>
                                            <option value="ecommerce">E-Commerce Platform</option>
                                            <option value="saas">SaaS Product</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Company / Organization</label>
                                        <input type="text" name="companyName" className={inputClass}
                                            placeholder="Your company name (optional)"
                                            value={formData.companyName} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Contact Email *</label>
                                        <input type="email" name="contactEmail" required className={inputClass}
                                            value={formData.contactEmail} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Contact Phone</label>
                                        <input type="tel" name="contactPhone" className={inputClass}
                                            placeholder="+1 (555) 123-4567"
                                            value={formData.contactPhone} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={() => setCurrentSection(2)}>
                                        Next: Problem & Goals
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Problem Statement & Objectives */}
                        {currentSection === 2 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">2</span>
                                    <h2 className="text-xl font-bold">Problem Statement & Objectives</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>Problem Statement *</label>
                                        <p className="text-xs text-mono-500 mb-2">What problem does this software solve? Who faces this problem?</p>
                                        <textarea name="problemStatement" required rows={4} className={inputClass}
                                            placeholder="Describe the current pain points and challenges that this project aims to address..."
                                            value={formData.problemStatement} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Project Objectives *</label>
                                        <p className="text-xs text-mono-500 mb-2">What are the main goals of this project?</p>
                                        <textarea name="projectObjectives" required rows={3} className={inputClass}
                                            placeholder="1. Reduce manual data entry by 80%&#10;2. Enable real-time collaboration&#10;3. Provide analytics dashboard"
                                            value={formData.projectObjectives} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Success Criteria</label>
                                        <p className="text-xs text-mono-500 mb-2">How will you measure if this project is successful?</p>
                                        <textarea name="successCriteria" rows={2} className={inputClass}
                                            placeholder="e.g. 1000 active users within 3 months, 50% reduction in processing time..."
                                            value={formData.successCriteria} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="secondary" onClick={() => setCurrentSection(1)}>Previous</Button>
                                    <Button variant="primary" onClick={() => setCurrentSection(3)}>Next: Scope & Features</Button>
                                </div>
                            </div>
                        )}

                        {/* Section 3: Scope & Features */}
                        {currentSection === 3 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">3</span>
                                    <h2 className="text-xl font-bold">Scope & Features</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>In-Scope Features (Must Have) *</label>
                                        <p className="text-xs text-mono-500 mb-2">Core features that MUST be included in the first release.</p>
                                        <textarea name="inScopeFeatures" required rows={4} className={inputClass}
                                            placeholder="- User authentication (email, Google OAuth)&#10;- Dashboard with analytics&#10;- CRUD operations for projects&#10;- Email notifications"
                                            value={formData.inScopeFeatures} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>MVP Features (Minimum Viable Product)</label>
                                        <p className="text-xs text-mono-500 mb-2">If we need to prioritize, which features are absolutely essential?</p>
                                        <textarea name="mvpFeatures" rows={3} className={inputClass}
                                            placeholder="- User login&#10;- Create/View items&#10;- Basic search"
                                            value={formData.mvpFeatures} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Out of Scope (Explicitly NOT Included)</label>
                                        <p className="text-xs text-mono-500 mb-2">Features that should NOT be part of this phase.</p>
                                        <textarea name="outOfScopeFeatures" rows={2} className={inputClass}
                                            placeholder="- Mobile app (web only for now)&#10;- Multi-language support"
                                            value={formData.outOfScopeFeatures} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Future Enhancements (Nice to Have)</label>
                                        <p className="text-xs text-mono-500 mb-2">Features for future versions.</p>
                                        <textarea name="futureEnhancements" rows={2} className={inputClass}
                                            placeholder="- AI recommendations&#10;- Integration with Slack"
                                            value={formData.futureEnhancements} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="secondary" onClick={() => setCurrentSection(2)}>Previous</Button>
                                    <Button variant="primary" onClick={() => setCurrentSection(4)}>Next: Technical</Button>
                                </div>
                            </div>
                        )}

                        {/* Section 4: Technical Requirements */}
                        {currentSection === 4 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">4</span>
                                    <h2 className="text-xl font-bold">Technical Requirements</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>Preferred Tech Stack</label>
                                        <select name="techStack" className={inputClass} value={formData.techStack} onChange={handleChange}>
                                            <option value="any">No Preference (You Decide)</option>
                                            <option value="react-node">React + Node.js</option>
                                            <option value="nextjs">Next.js (Full Stack)</option>
                                            <option value="react-firebase">React + Firebase</option>
                                            <option value="vue-node">Vue.js + Node.js</option>
                                            <option value="react-native">React Native (Mobile)</option>
                                            <option value="flutter">Flutter (Mobile)</option>
                                            <option value="python-django">Python + Django</option>
                                            <option value="other">Other (specify in notes)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Platform Requirements</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                            {[
                                                { value: 'web', label: 'Web Browser', icon: Globe },
                                                { value: 'ios', label: 'iOS', icon: Smartphone },
                                                { value: 'android', label: 'Android', icon: Smartphone },
                                                { value: 'desktop', label: 'Desktop', icon: Layers },
                                                { value: 'pwa', label: 'PWA', icon: Globe },
                                            ].map(platform => (
                                                <label key={platform.value} className={`cursor-pointer border rounded-xl p-3 flex items-center gap-2 transition-all ${formData.platformRequirements.includes(platform.value)
                                                    ? 'border-mono-950 dark:border-white bg-mono-100 dark:bg-mono-800'
                                                    : 'border-mono-200 dark:border-mono-700 hover:border-mono-400'
                                                    }`}>
                                                    <input type="checkbox" name="platformRequirements" value={platform.value}
                                                        checked={formData.platformRequirements.includes(platform.value)}
                                                        onChange={handleCheckboxChange} className="hidden" />
                                                    <platform.icon size={18} className="text-mono-500" />
                                                    <span className="text-sm">{platform.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Required Integrations</label>
                                        <textarea name="integrations" rows={2} className={inputClass}
                                            placeholder="e.g. Stripe for payments, SendGrid for emails, Google Maps API..."
                                            value={formData.integrations} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Performance Requirements</label>
                                        <textarea name="performanceRequirements" rows={2} className={inputClass}
                                            placeholder="e.g. Page load under 2s, support 1000 concurrent users..."
                                            value={formData.performanceRequirements} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Security Requirements</label>
                                        <textarea name="securityRequirements" rows={2} className={inputClass}
                                            placeholder="e.g. HTTPS, data encryption, GDPR compliance, 2FA..."
                                            value={formData.securityRequirements} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="secondary" onClick={() => setCurrentSection(3)}>Previous</Button>
                                    <Button variant="primary" onClick={() => setCurrentSection(5)}>Next: Users</Button>
                                </div>
                            </div>
                        )}

                        {/* Section 5: User Requirements */}
                        {currentSection === 5 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">5</span>
                                    <h2 className="text-xl font-bold">User Requirements</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>Target Audience *</label>
                                        <p className="text-xs text-mono-500 mb-2">Who will use this software?</p>
                                        <textarea name="targetAudience" required rows={2} className={inputClass}
                                            placeholder="e.g. Small business owners, age 25-45, who need to manage inventory..."
                                            value={formData.targetAudience} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>User Roles & Permissions</label>
                                        <p className="text-xs text-mono-500 mb-2">Different types of users and their access levels.</p>
                                        <textarea name="userRoles" rows={3} className={inputClass}
                                            placeholder="- Admin: Full access, manage users&#10;- Manager: View reports, manage team&#10;- User: Basic CRUD operations"
                                            value={formData.userRoles} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Key User Flows</label>
                                        <p className="text-xs text-mono-500 mb-2">Main workflows users will perform.</p>
                                        <textarea name="userFlows" rows={3} className={inputClass}
                                            placeholder="1. User signs up → Verifies email → Completes profile&#10;2. User creates project → Adds tasks → Invites team"
                                            value={formData.userFlows} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="secondary" onClick={() => setCurrentSection(4)}>Previous</Button>
                                    <Button variant="primary" onClick={() => setCurrentSection(6)}>Next: Constraints</Button>
                                </div>
                            </div>
                        )}

                        {/* Section 6: Constraints & Dependencies */}
                        {currentSection === 6 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">6</span>
                                    <h2 className="text-xl font-bold">Constraints & Dependencies</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}>Budget Range *</label>
                                            <select name="budget" required className={inputClass} value={formData.budget} onChange={handleChange}>
                                                <option value="10-20">$10 - $20</option>
                                                <option value="20-50">$20 - $50</option>
                                                <option value="50-100">$50 - $100</option>
                                                <option value="100-200">$100 - $200</option>
                                                <option value="200-500">$200 - $500</option>
                                                <option value="500+">$500+</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Timeline Preference *</label>
                                            <select name="timeline" required className={inputClass} value={formData.timeline} onChange={handleChange}>
                                                <option value="urgent">Urgent (7 days)</option>
                                                <option value="normal">Normal (2-3 weeks)</option>
                                                <option value="flexible">Flexible (1 month+)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Known Constraints</label>
                                        <p className="text-xs text-mono-500 mb-2">Any limitations or restrictions we should know about.</p>
                                        <textarea name="constraints" rows={2} className={inputClass}
                                            placeholder="e.g. Must work offline, limited hosting budget, specific compliance requirements..."
                                            value={formData.constraints} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>External Dependencies</label>
                                        <p className="text-xs text-mono-500 mb-2">Third-party systems or approvals required.</p>
                                        <textarea name="dependencies" rows={2} className={inputClass}
                                            placeholder="e.g. Waiting for API access from partner, need design approval from marketing..."
                                            value={formData.dependencies} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Priority Level</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'standard'
                                                ? 'border-mono-950 dark:border-white bg-mono-100 dark:bg-mono-800'
                                                : 'border-mono-200 dark:border-mono-700 hover:border-mono-400'
                                                }`}>
                                                <input type="radio" name="priority" value="standard" className="hidden"
                                                    checked={formData.priority === 'standard'} onChange={handleChange} />
                                                <span className="font-bold">Standard</span>
                                                <span className="text-xs text-mono-500">14-21 Days Turnaround</span>
                                            </label>
                                            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'rush'
                                                ? 'border-mono-950 dark:border-white bg-mono-100 dark:bg-mono-800'
                                                : 'border-mono-200 dark:border-mono-700 hover:border-mono-400'
                                                }`}>
                                                <input type="radio" name="priority" value="rush" className="hidden"
                                                    checked={formData.priority === 'rush'} onChange={handleChange} />
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">Rush</span>
                                                    <span className="bg-mono-950 dark:bg-white text-white dark:text-mono-950 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Fast</span>
                                                </div>
                                                <span className="text-xs text-mono-500">7-Day MAX Guarantee</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="secondary" onClick={() => setCurrentSection(5)}>Previous</Button>
                                    <Button variant="primary" onClick={() => setCurrentSection(7)}>Next: Review & Submit</Button>
                                </div>
                            </div>
                        )}

                        {/* Section 7: Additional Info & Submit */}
                        {currentSection === 7 && (
                            <div className={sectionClass}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-mono-100 dark:bg-mono-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold">7</span>
                                    <h2 className="text-xl font-bold">Additional Information & Submit</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>Design References</label>
                                        <p className="text-xs text-mono-500 mb-2">Links to designs, mockups, or reference websites.</p>
                                        <textarea name="designReferences" rows={2} className={inputClass}
                                            placeholder="https://dribbble.com/example&#10;https://figma.com/file/..."
                                            value={formData.designReferences} onChange={handleChange} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Additional Notes</label>
                                        <textarea name="additionalNotes" rows={3} className={inputClass}
                                            placeholder="Anything else we should know about this project..."
                                            value={formData.additionalNotes} onChange={handleChange} />
                                    </div>

                                    {/* Summary Preview */}
                                    <div className="bg-mono-50 dark:bg-mono-800 rounded-xl p-6 border border-mono-200 dark:border-mono-700">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <CheckCircle2 size={18} className="text-green-500" />
                                            Request Summary
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-mono-500">Project:</span>
                                                <p className="font-medium">{formData.projectName || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-mono-500">Type:</span>
                                                <p className="font-medium capitalize">{formData.projectType.replace('-', ' ')}</p>
                                            </div>
                                            <div>
                                                <span className="text-mono-500">Budget:</span>
                                                <p className="font-medium">${formData.budget}</p>
                                            </div>
                                            <div>
                                                <span className="text-mono-500">Timeline:</span>
                                                <p className="font-medium capitalize">{formData.timeline}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button variant="secondary" onClick={() => setCurrentSection(6)}>Previous</Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="px-8"
                                    >
                                        {loading ? <LogoLoader size={24} /> : 'Submit SRS Document'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RequestProjectPage;
