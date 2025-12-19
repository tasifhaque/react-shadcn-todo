import { firebaseAuth, firebaseDB } from "@/lib/db";
import { useAuthStore } from "@/store/authStore";
import { useTodoStore } from "@/store/todoStore";
import { onAuthStateChanged } from "firebase/auth";
import { get, onValue, ref } from "firebase/database";
import { useEffect, type ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setLoading, setUser, removeUser } = useAuthStore();
  const { setTodo, removeTodo } = useTodoStore();

  useEffect(() => {
    let firebaseListener: any;
    setLoading(true);

    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user?.uid) {
        const userData = (
          await get(ref(firebaseDB, `users/${user?.uid}`))
        ).val();
        setUser(userData);
        setTodo(userData.todos || []);

        firebaseListener = onValue(
          ref(firebaseDB, "users/" + user?.uid),
          (snapshot) => {
            const value = snapshot.val();
            setUser(value);
            setTodo(value.todos || []);
          }
        );
      } else {
        removeUser();
        removeTodo();
      }
      setLoading(false);
    });

    return () => {
      firebaseListener();
    };
  }, []);

  return children;
};

export default AuthProvider;
