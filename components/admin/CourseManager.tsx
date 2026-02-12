import React, { useEffect, useState } from 'react';
import { CourseData, getCourses, addCourse, updateCourse, deleteCourse } from '../../lib/courses';
import Button from '../ui/Button';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import LogoLoader from '../ui/LogoLoader';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManager: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<CourseData>>({
        title: '',
        description: '',
        instructor: '',
        price: '',
        duration: '',
        level: 'Beginner',
        image: '',
        rating: 5.0,
        students: 0,
        tags: [],
        whatYouLearn: [],
        whatYouGet: [],
        videos: [],
        gallery: [],
        audioFiles: [],
        studyMaterials: []
    });

    const [tagsInput, setTagsInput] = useState('');
    const [whatYouLearnInput, setWhatYouLearnInput] = useState('');
    const [whatYouGetInput, setWhatYouGetInput] = useState('');
    const [videosInput, setVideosInput] = useState('');
    const [galleryInput, setGalleryInput] = useState('');
    const [audioInput, setAudioInput] = useState('');
    const [chaptersInput, setChaptersInput] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (course?: CourseData) => {
        if (course) {
            setEditingCourse(course);
            setFormData(course);
            setTagsInput(course.tags ? course.tags.join(', ') : '');
            setWhatYouLearnInput(course.whatYouLearn ? course.whatYouLearn.join('\n') : '');
            setWhatYouGetInput(course.whatYouGet ? course.whatYouGet.join('\n') : '');
            setVideosInput(course.videos ? course.videos.map(v => `${v.title} | ${v.url}`).join('\n') : '');
            setGalleryInput(course.gallery ? course.gallery.join('\n') : '');
            setAudioInput(course.audioFiles ? course.audioFiles.map(a => `${a.title} | ${a.url}`).join('\n') : '');
            setStudyInput(course.studyMaterials ? course.studyMaterials.map(s => `${s.title} | ${s.url}`).join('\n') : '');
            setChaptersInput(course.chapters ? course.chapters.map(c => `### ${c.title}\n${c.content}\n---`).join('\n') : '');
        } else {
            setEditingCourse(null);
            setFormData({
                title: '',
                description: '',
                instructor: '',
                price: '',
                duration: '',
                level: 'Beginner',
                image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
                rating: 5.0,
                students: 0,
                tags: [],
                whatYouLearn: [],
                whatYouGet: [],
                videos: [],
                gallery: [],
                audioFiles: [],
                studyMaterials: [],
                chapters: []
            });
            setTagsInput('');
            setWhatYouLearnInput('');
            setWhatYouGetInput('');
            setVideosInput('');
            setGalleryInput('');
            setAudioInput('');
            setStudyInput('');
            setChaptersInput('');
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const parseContentItems = (input: string) => {
                return input.split('\n')
                    .map(line => {
                        const [title, url] = line.split('|').map(s => s.trim());
                        if (title && url) return { title, url };
                        return null;
                    })
                    .filter(item => item !== null) as { title: string; url: string }[];
            };

            const parseChapters = (input: string) => {
                // Split by separator '---'
                return input.split('---').map((chunk, idx) => {
                    const lines = chunk.trim().split('\n');
                    if (lines.length === 0) return null;

                    let title = `Chapter ${idx + 1}`;
                    let content = chunk.trim();

                    // Try to find a title line starting with ###
                    const titleLineIndex = lines.findIndex(l => l.trim().startsWith('###'));
                    if (titleLineIndex !== -1) {
                        title = lines[titleLineIndex].replace(/^###\s*/, '').trim();
                        // Remove title line from content
                        const contentLines = [...lines];
                        contentLines.splice(titleLineIndex, 1);
                        content = contentLines.join('\n').trim();
                    }

                    if (!content && !title) return null;
                    if (content === '' && title.startsWith('Chapter')) return null; // skip empty chunks

                    return {
                        id: `chap-${Date.now()}-${idx}`,
                        title,
                        content
                    };
                }).filter(c => c !== null) as { id: string; title: string; content: string }[];
            };

            const courseData = {
                ...formData,
                tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                whatYouLearn: whatYouLearnInput.split('\n').map(item => item.trim()).filter(item => item !== ''),
                whatYouGet: whatYouGetInput.split('\n').map(item => item.trim()).filter(item => item !== ''),
                videos: parseContentItems(videosInput),
                gallery: galleryInput.split('\n').map(url => url.trim()).filter(url => url !== ''),
                audioFiles: parseContentItems(audioInput),
                studyMaterials: parseContentItems(studyInput),
                chapters: parseChapters(chaptersInput)
            } as CourseData;

            if (editingCourse && editingCourse.id) {
                await updateCourse(editingCourse.id, courseData);
            } else {
                await addCourse(courseData);
            }
            setIsModalOpen(false);
            fetchCourses();
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(id);
            fetchCourses();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h2>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={18} /> Add Course
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><LogoLoader /></div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <AnimatePresence>
                                    {courses.map(course => (
                                        <motion.tr
                                            layout
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => handleOpenModal(course)}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={course.image} alt={course.title} className="w-8 h-8 rounded object-cover" />
                                                    <div className="font-medium text-gray-900 dark:text-white max-w-xs truncate">{course.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{course.instructor}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{course.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); course.id && handleDelete(course.id); }}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No courses found. Click 'Seed Default Courses' to import them.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingCourse ? 'Edit Course' : 'New Course'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)}><X /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Instructor</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.instructor}
                                        onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Level</label>
                                    <select
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image URL</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                    <input
                                        className="w-full p-2 rounded border bg-transparent"
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                        placeholder="React, Frontend, Web"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">What You'll Learn (One per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={4}
                                        value={whatYouLearnInput}
                                        onChange={e => setWhatYouLearnInput(e.target.value)}
                                        placeholder="Build a full-stack app&#10;Master React Hooks&#10;Deploy to production"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">What You Get (One per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={4}
                                        value={whatYouGetInput}
                                        onChange={e => setWhatYouGetInput(e.target.value)}
                                        placeholder="Certificate of completion&#10;Downloadable resources&#10;Lifetime access"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Chapters (Text Content)</label>
                                    <p className="text-xs text-mono-500 mb-2">Use ### Title to start a chapter. Separate chapters with ---</p>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent font-mono text-sm"
                                        rows={8}
                                        value={chaptersInput}
                                        onChange={e => setChaptersInput(e.target.value)}
                                        placeholder="### Introduction&#10;Welcome to the course...&#10;&#10;---&#10;&#10;### Chapter 1&#10;Let's get started..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Videos (Title | URL per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={3}
                                        value={videosInput}
                                        onChange={e => setVideosInput(e.target.value)}
                                        placeholder="Intro | https://youtube.com/..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image Gallery (URL per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={3}
                                        value={galleryInput}
                                        onChange={e => setGalleryInput(e.target.value)}
                                        placeholder="https://example.com/image1.jpg"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Audio Files (Title | URL per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={3}
                                        value={audioInput}
                                        onChange={e => setAudioInput(e.target.value)}
                                        placeholder="Podcast Ep 1 | https://example.com/audio.mp3"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Study Materials (Title | URL per line)</label>
                                    <textarea
                                        className="w-full p-2 rounded border bg-transparent"
                                        rows={3}
                                        value={studyInput}
                                        onChange={e => setStudyInput(e.target.value)}
                                        placeholder="Cheat Sheet | https://example.com/sheet.pdf"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>{editingCourse ? 'Save Changes' : 'Create Course'}</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManager;
