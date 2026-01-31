const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin (check if already initialized to avoid errors if run differently)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const PROJECTS = [
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

const BLOG_POSTS = [
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

async function seedData() {
    console.log('Starting migration...');

    // Seed Projects
    console.log(`Uploading ${PROJECTS.length} projects...`);
    for (const project of PROJECTS) {
        // Use custom ID as string to match our generic string assumption in some places, or keep simple
        // Using string ID is generally safer for Firestore
        const docRef = db.collection('projects').doc(String(project.id));
        await docRef.set({
            ...project,
            // ensure ID is consistently stored
            id: project.id
        });
        process.stdout.write('.');
    }
    console.log('\nProjects uploaded successfully.');

    // Seed Blogs
    console.log(`Uploading ${BLOG_POSTS.length} blog posts...`);
    for (const post of BLOG_POSTS) {
        const docRef = db.collection('blogs').doc(String(post.id));
        await docRef.set({
            ...post,
            id: post.id
        });
        process.stdout.write('.');
    }
    console.log('\nBlog posts uploaded successfully.');
}

seedData().catch(console.error);
