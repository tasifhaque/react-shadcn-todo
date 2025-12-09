import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserType = {
  uid: string;
  email: string;
  name: string;
};

export type AuthStoreType = {
  user: UserType | null;
  authLoading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserType) => void;
  removeUser: () => void;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      authLoading: false,
      setLoading: (loading) => set({ authLoading: loading }),
      setUser: (user) => set({ user }),
      removeUser: () => set({ user: null }),
    }),
    { name: "authUser" }
  )
);