import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "@/firebase.ts";
import Item from "@/types/Item.ts";
import { getDownloadURL, ref } from "firebase/storage";

export const getItems = async () => {
  const snapshot = await getDocs(collection(db, "items"));
  return Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data() as Item;
      const url = await getDownloadURL(ref(storage, data.storageUrl));
      return {
        id: doc.id,
        ...(doc.data() as Item),
        url,
        ref: doc.ref,
      };
    }),
  );
};
