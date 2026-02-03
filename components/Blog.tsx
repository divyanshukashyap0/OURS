import React, { useState, useEffect } from 'react';
import Section from './Section';
import { getBlogPosts, BlogData } from '../lib/blogs';
import { useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Section
      id="blog"
      title="OURS Blog"
      subtitle="Tips, tricks, and tutorials to keep you up to date with the industry."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            className="flex flex-col md:flex-row gap-6 items-start group cursor-pointer border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 p-4 rounded-xl transition-colors"
          >
            <div className="w-full md:w-64 h-40 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <span className="text-sm font-semibold text-gray-900 dark:text-white underline decoration-2 decoration-blue-100 dark:decoration-blue-900 group-hover:decoration-blue-600 dark:group-hover:decoration-blue-400 transition-all">
                Read Article
              </span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Blog;