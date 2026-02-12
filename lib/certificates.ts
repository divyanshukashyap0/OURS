import { db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface CertificateData {
    id: string; // The public ID (e.g., OURS-XXXX-YYYY)
    userId: string;
    userName: string;
    courseId: string;
    courseTitle: string;
    instructor: string;
    issuedAt: Timestamp;
    image?: string; // Course image for display
}

// Generate a random 8-character alphanumeric string 
const generateCertificateId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1 to avoid confusion
    let result = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CERT-${result}`;
};

export const getOrCreateCertificate = async (
    userId: string,
    userName: string,
    courseId: string,
    courseTitle: string,
    instructor: string,
    courseImage?: string
): Promise<CertificateData | null> => {
    try {
        // 1. Check if certificate already exists for this user and course
        const q = query(
            collection(db, 'certificates'),
            where('userId', '==', userId),
            where('courseId', '==', courseId)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs[0].data() as CertificateData;
        }

        // 2. If not, create a new one
        const newId = generateCertificateId();
        const certData: CertificateData = {
            id: newId,
            userId,
            userName,
            courseId,
            courseTitle,
            instructor,
            issuedAt: Timestamp.now(),
            image: courseImage || ''
        };

        // Use the ID as the document ID for easy lookup if we verify by ID (alternative: separate verify field)
        // Actually, creating a document with the ID as the key makes verification lookup O(1)
        await setDoc(doc(db, 'certificates', newId), certData);

        return certData;
    } catch (error) {
        console.error("Error getting/creating certificate:", error);
        return null;
    }
};

export const verifyCertificate = async (certId: string): Promise<CertificateData | null> => {
    try {
        const docRef = doc(db, 'certificates', certId.toUpperCase().trim());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as CertificateData;
        }
        return null;
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return null;
    }
};
