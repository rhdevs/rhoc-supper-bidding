import { useEffect, useState } from "react";
import { Image, Space } from "@mantine/core";
import { Flex } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import Item from "@/types/Item.ts";
import { onSnapshot, DocumentReference, getDoc } from "@firebase/firestore";

import AdminNavbar from "@/components/shared/AdminNavbar";

type LoaderDataProps = {
  item: Item;
  url: string;
  amount: number;
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
        <Flex
          direction={"column"}
          justify={"center"}
          align={"center"}
          gap={"md"}
        >
          <Space h={"xl"} />
          <h1 className={"text-5xl font-bold"}>{item.name}</h1>
          <Image
            src={data.url}
            alt={item.name}
            style={{
              width: "350px",
              height: "350px",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          ></Image>
          <h2 className={"text-3xl font-bold"}>
            Current Bid Amount: {data.amount}
          </h2>
        </Flex>
      )}
    </main>
  );
};

export default Index;
