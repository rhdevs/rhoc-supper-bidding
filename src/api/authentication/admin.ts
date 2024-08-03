import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase.ts";
import { redirect } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export const getAdminStatus = async () => {
  return await new Promise<{ user: User }>((resolve, reject) => {
    // first checks if user logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ user });
      } else {
        reject(redirect("/admin/login"));
      }
      unsubscribe();
    });
  }).then(async (data) => {
    // then checks if user is admin
    const { user } = data;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Promise.reject(redirect("/admin/login"));
    }

    const userData = docSnap.data();

    if (!userData || !userData.isAdmin) {
      return Promise.reject(redirect("/admin/login"));
    }

    return { user };
  });
};

export const getAdminAlreadyLoggedIn = async () => {
  // strictly used by login page since its logic is the opposite
  return await new Promise<{ user: User | null }>((resolve) => {
    // checks if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve({ user });
      unsubscribe();
    });
  }).then(async (data) => {
    // we want the user to be not logged in
    // if the user is logged in and an admin, they should be redirected to the admin page
    const { user } = data;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()?.isAdmin) {
        return Promise.reject(redirect("/admin/items"));
      }
    }
    return null;
  });
};
