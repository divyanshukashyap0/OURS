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
    title: 'React.js Masterclass: Zero to Hero',
    instructor: 'Alex Johnson',
    description: 'Master React.js from scratch. Learn components, hooks, context API, and build real-world applications.',
    duration: '12h 45m',
    level: 'Intermediate',
    rating: 4.9,
    students: 12500,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Frontend', 'Hooks'],
    price: '$49.99'
  },
  {
    id: 2,
    title: 'Advanced Next.js Pattern & Performance',
    instructor: 'Sarah Smith',
    description: 'Take your Next.js skills to the next level. Server Actions, App Router, optimization techniques, and more.',
    duration: '8h 30m',
    level: 'Advanced',
    rating: 4.8,
    students: 8200,
    image: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'SSR', 'Performance'],
    price: '$59.99'
  },
  {
    id: 3,
    title: 'Fullstack MERN Bootcamp',
    instructor: 'Mike Brown',
    description: 'Become a full-stack developer with the MERN stack. Build complete web applications with MongoDB, Express, React, and Node.',
    duration: '24h 15m',
    level: 'Intermediate',
    rating: 4.9,
    students: 20000,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['MongoDB', 'Express', 'React', 'Node'],
    price: '$89.99'
  },
  {
    id: 4,
    title: 'Python for Data Science',
    instructor: 'Emily Davis',
    description: 'Learn Python for data analysis, visualization, and machine learning. Pandas, NumPy, and Scikit-learn covered.',
    duration: '18h 00m',
    level: 'Beginner',
    rating: 4.7,
    students: 15000,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Python', 'Data Science', 'Pandas'],
    price: '$39.99'
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    instructor: 'Jessica Lee',
    description: 'Understand the fundamentals of UI/UX design. theory, wireframing, prototyping, and user testing.',
    duration: '6h 20m',
    level: 'Beginner',
    rating: 4.8,
    students: 5000,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Design', 'Figma', 'UI/UX'],
    price: '$29.99'
  },
  {
    id: 6,
    title: 'Docker & Kubernetes Mastery',
    instructor: 'David Wilson',
    description: 'Master containerization and orchestration. Build scalable and resilient infrastructure with Docker and Kubernetes.',
    duration: '10h 50m',
    level: 'Advanced',
    rating: 4.9,
    students: 9800,
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['DevOps', 'Docker', 'Kubernetes'],
    price: '$69.99'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Full Stack Netflix Clone',
    description: 'A complete replica of Netflix built with React, Firebase, and Stripe integration for subscriptions.',
    image: 'https://foolishdeveloper.com/wp-content/uploads/2024/01/Screenshot-356.png',
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
    date: 'April 12, 2024',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about AI integration...'
  },
  {
    id: 2,
    title: 'Mastering React Hooks',
    excerpt: 'A comprehensive guide to using useEffect, useState, and custom hooks effectively.',
    date: 'April 08, 2024',
    category: 'React',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about React Hooks...'
  },
  {
    id: 3,
    title: 'Tailwind CSS vs Bootstrap',
    excerpt: 'Comparing the two most popular CSS frameworks in 2024.',
    date: 'April 01, 2024',
    category: 'CSS',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Tailwind vs Bootstrap...'
  },
  {
    id: 4,
    title: 'Building Scalable Node.js APIs',
    excerpt: 'Best practices for structuring and optimizing your backend services.',
    date: 'March 25, 2024',
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1627398242450-2a01fea2686d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Node.js APIs...'
  },
  {
    id: 5,
    title: 'Next.js 14: What\'s New?',
    excerpt: 'Exploring server actions, partial prerendering, and other new features.',
    date: 'March 18, 2024',
    category: 'Next.js',
    image: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about Next.js 14...'
  },
  {
    id: 6,
    title: 'TypeScript for Beginners',
    excerpt: 'Why you should start using static typing in your JavaScript projects today.',
    date: 'March 10, 2024',
    category: 'TypeScript',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    content: 'Full article content about TypeScript...'
  }
];
