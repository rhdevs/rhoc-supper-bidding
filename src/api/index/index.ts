import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/firebase.ts";
import Item from "@/types/Item";
import { getDownloadURL, ref } from "firebase/storage";

export const getCurrentItem = async () => {
  const docRef = doc(db, "bids", "currentItem");
  const docSnap = await getDoc(docRef);
  // check types for user
  let url = "",
    amount = 0,
    user = "";

  if (!docSnap.exists()) {
    throw new Error("No current item found");
  }

  const itemSnap = await getDoc(docSnap.data().ref);

  if (!itemSnap.exists()) {
    throw new Error("Item does not exist");
  }

  const item = itemSnap.data() as Item;

  if (item.storageUrl == "") {
    console.error("Item does not have a valid storage URL.");
  } else {
    url = await getDownloadURL(ref(storage, item.storageUrl));
    amount = docSnap.data().amount;
    // add current user data into each bid
    user = docSnap.data().user;
  }

  return { item: item, url, amount, user, ref: docRef };
};
