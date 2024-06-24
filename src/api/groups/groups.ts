import { collection, getDocs } from "@firebase/firestore";
import { db } from "@/firebase.ts";


export const getGroups = async () => {
  const collectionRef = collection(db, "groups");
  return await getDocs(collectionRef);
}