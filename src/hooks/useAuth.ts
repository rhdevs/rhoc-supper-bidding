// src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const fetchCurrentUser = async (): Promise<User | null> => {
  return new Promise<User | null>((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
      unsubscribe();
    });
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: Infinity, // user data does not change frequently
    refetchOnWindowFocus: false, // prevent refetching on window focus
  });
};
