import { useEffect, useState } from "react";
// import { Flex } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import Item from "@/types/Item.ts";
import { onSnapshot, DocumentReference, getDoc } from "@firebase/firestore";

import AdminNavbar from "@/components/shared/AdminNavbar";

type LoaderDataProps = {
  item: Item;
  ref: DocumentReference;
};

const Index = () => {
  const data = useLoaderData() as LoaderDataProps;
  const [item, setItem] = useState<Item>(data.item);

  useEffect(() => {
    const unsubscribe = onSnapshot(data.ref, (doc) => {
      if (!doc.exists()) {
        throw new Error("No current item found");
      }
      const docRef = doc.data().ref as DocumentReference;
      getDoc(docRef).then((itemSnap) => {
        if (!itemSnap.exists()) {
          throw new Error("Item does not exist");
        }
        setItem(itemSnap.data() as Item);
      });
    });
    return () => unsubscribe();
  }, [data.ref]);

  return (
    <main>
      <AdminNavbar />
      {item.name === "nullItem" ? (
        <h1 className={"text-5xl font-bold"}>No current item</h1>
      ) : (
        <h1 className={"text-5xl font-bold"}>{item.name}</h1>
      )}
    </main>
  );
};

export default Index;
