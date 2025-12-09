import { firebaseAuth, firebaseDB } from "@/lib/db";
import { useAuthStore } from "@/store/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useEffect, type ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setLoading, setUser, removeUser } = useAuthStore();
  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user?.uid) {
        const { uid, name, email } = (
          await get(ref(firebaseDB, `users/${user?.uid}`))
        ).val();
        setUser({ uid, name, email });
      } else {
        removeUser();
      }
      setLoading(false);
    });
  }, []);

  return children;
};

export default AuthProvider;
