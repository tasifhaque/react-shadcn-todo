import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = {
  uid: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
};

export type AuthStoreType = {
  user: UserType | null;
  authLoading: boolean;
  authError: boolean;
  setUser: (user: Partial<UserType>) => void;
  removeUser: () => void;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      authLoading: true,
      authError: false,
      setUser: () => ({}),
      removeUser: () => set({ user: null, authLoading: false }),
    }),
    { name: "authUser" }
  )
);
