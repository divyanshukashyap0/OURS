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
    hasSecurityQuestions: boolean;
    checkSecurityStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    hasSecurityQuestions: false,
    checkSecurityStatus: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasSecurityQuestions, setHasSecurityQuestions] = useState(false);

    const checkSecurityStatus = async (uid: string) => {
        if (!uid) return;
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setHasSecurityQuestions(userSnap.data().hasSecurityQuestions || false);
            }
        } catch (error) {
            console.error("Error checking security status:", error);
        }
    };

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
                        createdAt: serverTimestamp(),
                        role: 'user', // Default role
                        hasSecurityQuestions: false
                    });
                    setHasSecurityQuestions(false);
                } else {
                    setHasSecurityQuestions(userSnap.data().hasSecurityQuestions || false);
                    // 12/28/2026: Optional - Update last logged in could go here
                }
            } else {
                setHasSecurityQuestions(false);
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
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            hasSecurityQuestions,
            checkSecurityStatus: () => user ? checkSecurityStatus(user.uid) : Promise.resolve()
        }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};
