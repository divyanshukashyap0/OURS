
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

export interface Chapter {
    id: string;
    title: string;
    content: string; // Markdown/HTML
    duration?: string;
    isFreePreview?: boolean;
}

export interface CourseData {
    id?: string;
    title: string;
    description: string;
    image: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: string;
    rating: number;
    students: number;
    instructor: string;
    duration: string;
    tags: string[];
    whatYouLearn: string[];
    whatYouGet: string[];
    chapters?: Chapter[]; // New Field
    videos?: { title: string; url: string }[];
    gallery?: string[];
    audioFiles?: { title: string; url: string }[];
    studyMaterials?: { title: string; url: string }[];
    createdAt?: Timestamp;
}

const COLLECTION_NAME = 'courses';

// Fetch single course by ID
export const getCourseById = async (id: string): Promise<CourseData | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CourseData;
    }
    return null;
};

// Fetch all courses
export const getCourses = async (): Promise<CourseData[]> => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as CourseData));
};

// Add a new course
export const addCourse = async (course: Omit<CourseData, 'id'>) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...course,
        createdAt: Timestamp.now()
    });
};

// Update a course
export const updateCourse = async (id: string, updates: Partial<CourseData>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
};

// Delete a course
export const deleteCourse = async (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
