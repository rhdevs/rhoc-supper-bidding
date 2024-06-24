import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.ts";

export const getCurrentItem = async () => {
  const docRef = doc(db, "bids", "currentItem");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("No current item found");
  }

  const itemSnap = await getDoc(docSnap.data().ref);

  if (!itemSnap.exists()) {
    throw new Error("Item does not exist");
  }

  return {item: itemSnap.data(), ref: docRef};
};
