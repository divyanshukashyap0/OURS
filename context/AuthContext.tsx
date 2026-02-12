import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import LoadingScreen from '../components/ui/LoadingScreen';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Sync user to Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || '',
                        role: 'user', // Default role
                        purchasedCourses: [], // Initialize with empty array
                        createdAt: serverTimestamp(),
                    });
                } else {
                    // 12/28/2026: Optional - Update last logged in could go here
                }
            }
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = () => {
        return firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};
