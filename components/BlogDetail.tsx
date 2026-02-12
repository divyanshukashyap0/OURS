import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPostById, BlogData } from '../lib/blogs';
import Footer from './Footer';
import Button from './ui/Button';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchPost = async () => {
            if (id) {
                try {
                    const data = await getBlogPostById(id);
                    setPost(data);
                } catch (error) {
                    console.error("Error fetching blog post:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">


            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-8 pl-0 hover:bg-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 gap-2"
                    >
                        <ArrowLeft size={20} /> Back to Blog
                    </Button>

                    <article>
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} /> {post.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <User size={16} /> {post.author || 'Admin'}
                                </span>
                                {post.readTime && (
                                    <span className="flex items-center gap-2">
                                        <Clock size={16} /> {post.readTime}
                                    </span>
                                )}
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                            <Tag size={12} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl overflow-hidden mb-10 h-64 md:h-96">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                {post.excerpt}
                            </p>
                            {post.content ? (
                                <div className="whitespace-pre-wrap">{post.content}</div>
                            ) : (
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                                </p>
                            )}
                            <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started</h2>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </article>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
