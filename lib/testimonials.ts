import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    text: string;
    rating: number;
    createdAt: any;
}

const COLLECTION_NAME = 'testimonials';

export const getTestimonials = async (): Promise<Testimonial[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Testimonial));
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
};

export const addTestimonial = async (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Error adding testimonial:", error);
        throw error;
    }
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        throw error;
    }
};

export const deleteTestimonial = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        throw error;
    }
};
