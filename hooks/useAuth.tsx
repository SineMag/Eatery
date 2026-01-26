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

// Import user service for Firestore operations
import { userService } from "../utils/user-service";

// Function to get user profile from Firestore
const getUserProfile = async (uid: string) => {
  try {
    return await userService.getUserProfile(uid);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const createInitialUserProfile = async (
  uid: string,
  email: string,
  name: string,
  surname: string,
) => {
  // Mock implementation - do nothing for now
  console.log("Creating initial user profile for:", uid);
};

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid || "null");

      if (firebaseUser) {
        // Set basic user data immediately to prevent loops
        const basicUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName?.split(" ")[0] || "User",
          surname:
            firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
          contactNumber: "",
          address: "",
          firebaseUser,
        };

        setUser(basicUserData);
        console.log("Set basic user data:", basicUserData.name);

        // Fetch profile data asynchronously in background
        getUserProfile(firebaseUser.uid)
          .then((userProfile) => {
            if (userProfile && userProfile.name) {
              console.log("Updating with Firestore profile data");
              setUser({
                uid: userProfile.uid,
                email: userProfile.email,
                name: userProfile.name,
                surname: userProfile.surname || "",
                contactNumber: userProfile.contactNumber || "",
                address: "",
                firebaseUser,
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching profile:", error);
          });
      } else {
        console.log("User signed out");
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
