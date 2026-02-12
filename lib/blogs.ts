import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface BlogData {
    id?: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    content: string;
    tags?: string[]; // New Field
    author?: string; // New Field: "Name | Role" or just Name
    readTime?: string; // New Field: e.g., "5 min read"
    createdAt?: Timestamp;
}

const COLLECTION_NAME = 'blogs';

// Fetch single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogData | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BlogData;
    }
    return null;
};

// Fetch all blog posts
export const getBlogPosts = async (): Promise<BlogData[]> => {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as BlogData));
};

// Add a new blog post
export const addBlogPost = async (post: Omit<BlogData, 'id'>) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...post,
        createdAt: Timestamp.now()
    });
};

// Update a blog post
export const updateBlogPost = async (id: string, updates: Partial<BlogData>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
};

// Delete a blog post
export const deleteBlogPost = async (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
