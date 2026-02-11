export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string; // YouTube ID or direct URL
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
}

export const TUTORIALS: Video[] = [
    {
        id: '1',
        title: 'Build a Netflix Clone with React & Firebase',
        description: 'Learn to build a full-featured Netflix clone using React, Redux, and Firebase. Implement user authentication, Stripe payments, and movie data fetching from TMDB.',
        thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2669&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/3h0_v1cdUhk', // Placeholder ID
        duration: '5h 30m',
        difficulty: 'Intermediate',
        tags: ['React', 'Firebase', 'Stripe', 'Redux']
    },
    {
        id: '2',
        title: 'Full Stack Spotify Clone (Next.js 14)',
        description: 'Master modern web development by building a pixel-perfect Spotify clone. Features includes song uploads, player controls, playlists, and Stripe integration.',
        thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/2aeMRm7taDI',
        duration: '8h 15m',
        difficulty: 'Advanced',
        tags: ['Next.js', 'Supabase', 'PostgreSQL', 'Tailwind']
    },
    {
        id: '3',
        title: 'AI SaaS Platform with Next.js & OpenAI',
        description: 'Build a production-ready AI SaaS platform. Integrate OpenAI API for image, code, and conversation generation. Includes subscription management with Stripe.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/r895rFUbZyk',
        duration: '10h',
        difficulty: 'Advanced',
        tags: ['Next.js', 'OpenAI', 'Prisma', 'Stripe']
    },
    {
        id: '4',
        title: 'E-commerce Dashboard with React & Charts.js',
        description: 'Create a powerful admin dashboard for an e-commerce platform. Visualize data with Charts.js, manage products, and handle orders.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/Ejrb_Wga3L4',
        duration: '4h 45m',
        difficulty: 'Intermediate',
        tags: ['React', 'Charts.js', 'Material UI']
    },
    {
        id: '5',
        title: 'Real-time Chat App with Socket.io',
        description: 'Build a real-time chat application similar to WhatsApp. Learn about WebSockets, database design for messages, and online status indicators.',
        thumbnail: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=2574&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/tBr-PybP_9c',
        duration: '6h 20m',
        difficulty: 'Advanced',
        tags: ['Socket.io', 'Node.js', 'React', 'MongoDB']
    },
    {
        id: '6',
        title: 'Portfolio Website with 3D Animations',
        description: 'Create a stunning personal portfolio using Three.js and React Three Fiber. Learn to add 3D models and interactive animations to your site.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/Q7AOvWpIVHU',
        duration: '3h',
        difficulty: 'Beginner',
        tags: ['Three.js', 'React', 'Framer Motion']
    }
];
