import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, CheckSquare, Square, BookOpen, Clock, Video, Search } from 'lucide-react';
import Button from '../ui/Button';
import BulkActionToolbar from './content/BulkActionToolbar';
import FilterBar from './content/FilterBar';

import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, writeBatch } from 'firebase/firestore';

interface Course {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    category: string;
    duration: string;
    lectures: number;
    level: string;
    rating: number;
    students: number;
}

const CourseManager: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const [formData, setFormData] = useState<Partial<Course>>({
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
        duration: '',
        lectures: 0,
        level: 'Beginner',
        rating: 0,
        students: 0
    });

    React.useEffect(() => {
        const q = query(collection(db, 'courses'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Course[];
            setCourses(fetchedCourses);
        }, (error) => {
            console.error("Error fetching courses:", error);
        });

        return () => unsubscribe();
    }, []);

    const filteredCourses = useMemo(() => {
        let result = courses.filter(c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === 'newest') {
            return result.reverse();
        } else if (sortBy === 'title') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [courses, searchTerm, sortBy]);

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedItems(newSelection);
    };

    const toggleAll = () => {
        if (selectedItems.size === filteredCourses.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredCourses.map(c => c.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (confirm(`Are you sure you want to delete ${selectedItems.size} courses?`)) {
            const batch = writeBatch(db);
            selectedItems.forEach(id => {
                const ref = doc(db, 'courses', id);
                batch.delete(ref);
            });
            try {
                await batch.commit();
                setSelectedItems(new Set());
            } catch (error) {
                console.error("Batch delete failed:", error);
                alert("Failed to delete selected courses.");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteDoc(doc(db, 'courses', id));
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Failed to delete course.");
            }
        }
    };

    const handleOpenModal = (course?: Course) => {
        if (course) {
            setEditingCourse(course);
            setFormData(course);
        } else {
            setEditingCourse(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                image: '',
                category: '',
                duration: '',
                lectures: 0,
                level: 'Beginner',
                rating: 0,
                students: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await updateDoc(doc(db, 'courses', editingCourse.id), formData);
            } else {
                await addDoc(collection(db, 'courses'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Error saving course:", error);
            alert(`Failed to save course: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Manager</h1>
                <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={18} />}>
                    Add Course
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <FilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search courses..."
                    sortOptions={[
                        { label: 'Newest', value: 'newest' },
                        { label: 'Title (A-Z)', value: 'title' },
                    ]}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <button onClick={toggleAll} className="text-gray-400 hover:text-blue-500">
                                        {selectedItems.size > 0 && selectedItems.size === filteredCourses.length ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Stats</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {filteredCourses.map((course) => (
                                    <motion.tr
                                        layout
                                        key={course.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedItems.has(course.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelection(course.id)} className="text-gray-400 hover:text-blue-500">
                                                {selectedItems.has(course.id) ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4" onClick={() => handleOpenModal(course)}>
                                            <div className="flex items-center gap-3 cursor-pointer">
                                                {course.image && (
                                                    <img src={course.image} alt={course.title} className="w-10 h-10 rounded-lg object-cover" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white max-w-xs truncate">
                                                        {course.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{course.level}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{course.category}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col text-xs gap-1">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                                <span className="flex items-center gap-1"><Video size={12} /> {course.lectures} lectures</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{course.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(course)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No courses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BulkActionToolbar
                selectedCount={selectedItems.size}
                onClearSelection={() => setSelectedItems(new Set())}
                onDelete={handleBulkDelete}
            />

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                                        <input
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <input
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                        <input
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g. 10h 30m"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                                        <select
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingCourse ? 'Save Changes' : 'Create Course'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManager;
