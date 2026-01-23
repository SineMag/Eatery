import { User } from "@/types";
import { auth } from "@/utils/firebase";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: (User & { firebaseUser: FirebaseUser }) | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<
    (User & { firebaseUser: FirebaseUser }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Try to fetch user profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);

          if (userProfile) {
            // User profile exists, use it
            setUser({
              ...userProfile,
              firebaseUser,
            });
          } else {
            // Create initial user profile if it doesn't exist
            await createInitialUserProfile(
              firebaseUser.uid,
              firebaseUser.email!,
              firebaseUser.displayName?.split(" ")[0] || "",
              firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
            );

            // Fetch the newly created profile
            const newProfile = await getUserProfile(firebaseUser.uid);
            if (newProfile) {
              setUser({
                ...newProfile,
                firebaseUser,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to basic user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName?.split(" ")[0] || "",
            surname:
              firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
            contactNumber: "",
            address: "",
            firebaseUser,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
