import {
  Code2,
  Database,
  Globe,
  Cpu,
  Layers,
  Smartphone,
  Terminal,
  Layout,
  Server,
  Cloud
} from 'lucide-react';
import { TechItem, Course, Project, BlogPost, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export const TECH_STACK: TechItem[] = [
  { name: 'React', icon: Code2 },
  { name: 'Node.js', icon: Server },
  { name: 'MongoDB', icon: Database },
  { name: 'Next.js', icon: Layout },
  { name: 'Tailwind', icon: Globe },
  { name: 'TypeScript', icon: Terminal },
  { name: 'Python', icon: Layers },
  { name: 'AWS', icon: Cloud },
];

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Full Stack MERN Blog Application',
    description: 'Build a complete blog with React, Node, Express, and MongoDB. Includes Auth and Dashboard.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Intermediate',
    price: '$29.99',
    rating: 4.8,
    students: 1240,
    tags: ['React', 'MERN', 'Full Stack']
  },
  {
    id: 2,
    title: 'Modern E-Commerce with Next.js 14',
    description: 'Learn the latest Next.js features while building a scalable e-commerce platform with Stripe.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Advanced',
    price: '$49.99',
    rating: 4.9,
    students: 850,
    tags: ['Next.js', 'Stripe', 'E-Commerce']
  },
  {
    id: 3,
    title: 'React Native for Beginners',
    description: 'Start building cross-platform mobile apps for iOS and Android using React Native.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Beginner',
    price: 'Free',
    rating: 4.7,
    students: 3200,
    tags: ['React Native', 'Mobile', 'iOS', 'Android']
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms in JS',
    description: 'Ace your technical interviews by mastering DSA using JavaScript.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    level: 'Intermediate',
    price: '$19.99',
    rating: 4.6,
    students: 1500,
    tags: ['DSA', 'JavaScript', 'Interview']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Full Stack Netflix Clone',
    description: 'A complete replica of Netflix built with React, Firebase, and Stripe integration for subscriptions.',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8efe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Firebase', 'Stripe', 'TMDB API'],
    price: '$2,000'
  },
  {
    id: 2,
    title: 'AI Image Generator',
    description: 'SaaS application that generates images from text using OpenAI DALL-E API and Next.js.',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'OpenAI', 'Tailwind', 'Prisma'],
    price: '$1,500'
  },
  {
    id: 3,
    title: 'Real-time Chat Application',
    description: 'Modern chat app with features like group chat, file sharing, and read receipts using Socket.io.',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['MERN', 'Socket.io', 'Chakra UI'],
    price: '$1,200'
  },
  {
    id: 4,
    title: 'E-Commerce Dashboard',
    description: 'Admin dashboard for managing products, orders, and customers with data visualization.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Recharts', 'Material UI'],
    price: '$1,800'
  },
  {
    id: 5,
    title: 'Travel Booking Platform',
    description: 'Full stack booking system for flights and hotels with search and payment processing.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'PostgreSQL', 'Tailwind'],
    price: '$2,500'
  },
  {
    id: 6,
    title: 'Crypto Portfolio Tracker',
    description: 'Track cryptocurrency prices in real-time and manage your investment portfolio.',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'CoinGecko API', 'Redux'],
    price: '$900'
  },
  {
    id: 7,
    title: 'Social Media App',
    description: 'A social network with feed, likes, comments, and user profiles.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['MERN', 'Redux', 'Cloudinary'],
    price: '$2,200'
  },
  {
    id: 8,
    title: 'Task Management Tool',
    description: 'Drag and drop Kanban board for personal and team productivity.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'dnd-kit', 'Tailwind'],
    price: '$800'
  },
  {
    id: 9,
    title: 'Weather Forecast App',
    description: 'Beautiful weather app with 7-day forecast and location detection.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'OpenWeather API', 'CSS Grid'],
    price: '$500'
  },
  {
    id: 10,
    title: 'Fitness Tracker',
    description: 'Track workouts, calories, and progress with charts and goals.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React Native', 'Firebase', 'Expo'],
    price: '$1,600'
  },
  {
    id: 11,
    title: 'Recipe & Meal Planner',
    description: 'Discover recipes and plan your weekly meals with shopping lists.',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'Contentful', 'GraphQL'],
    price: '$1,100'
  },
  {
    id: 12,
    title: 'Code Snippet Library',
    description: 'Save and organize useful code snippets with syntax highlighting.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Monaco Editor', 'Supabase'],
    price: '$1,300'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'The Future of Web Development: AI Integration',
    excerpt: 'How Artificial Intelligence is reshaping the way we build and interact with web applications.',
    date: 'April 12, 2026',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about AI integration...'
  },
  {
    id: 2,
    title: 'Mastering React Hooks',
    excerpt: 'A comprehensive guide to using useEffect, useState, and custom hooks effectively.',
    date: 'April 08, 2026',
    category: 'React',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about React Hooks...'
  },
  {
    id: 3,
    title: 'Tailwind CSS vs Bootstrap',
    excerpt: 'Comparing the two most popular CSS frameworks in 2026.',
    date: 'April 01, 2026',
    category: 'CSS',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Tailwind vs Bootstrap...'
  },
  {
    id: 4,
    title: 'Building Scalable Node.js APIs',
    excerpt: 'Best practices for structuring and optimizing your backend services.',
    date: 'March 25, 2026',
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1627398242450-2a01fea2686d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Node.js APIs...'
  },
  {
    id: 5,
    title: 'Next.js 14: What\'s New?',
    excerpt: 'Exploring server actions, partial prerendering, and other new features.',
    date: 'March 18, 2026',
    category: 'Next.js',
    image: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Next.js 14...'
  },
  {
    id: 6,
    title: 'TypeScript for Beginners',
    excerpt: 'Why you should start using static typing in your JavaScript projects today.',
    date: 'March 10, 2026',
    category: 'TypeScript',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about TypeScript...'
  }
];
