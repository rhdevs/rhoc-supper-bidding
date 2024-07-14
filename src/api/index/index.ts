import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/firebase.ts";
import Item from "@/types/Item";
import { getDownloadURL, ref } from "firebase/storage";

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

  const item = itemSnap.data() as Item;
  const url = await getDownloadURL(ref(storage, item.storageUrl));
  const amount = docSnap.data().amount;
  console.log(amount);

  return { item: item, url, amount, ref: docRef };
};
