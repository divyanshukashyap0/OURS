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

export interface ProjectData {
    id?: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    price?: string;
    githubLink?: string;
    previewUrl?: string;
    gallery?: string[];
    createdAt?: Timestamp;
}

const COLLECTION_NAME = 'projects';

// Fetch single project by ID
export const getProjectById = async (id: string): Promise<ProjectData | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ProjectData;
    }
    return null;
};

// Fetch all projects
export const getProjects = async (): Promise<ProjectData[]> => {
    // Note: ordering by raw 'id' string might not be ideal if '1', '10', '2' sorting happens
    // but for now we follow the structure.
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as ProjectData));
};

// Add a new project
export const addProject = async (project: Omit<ProjectData, 'id'>) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...project,
        createdAt: Timestamp.now()
    });
};

// Update a project
export const updateProject = async (id: string, updates: Partial<ProjectData>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
};

// Delete a project
export const deleteProject = async (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
