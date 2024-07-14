import { useLoaderData, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  SimpleGrid,
  Image,
  Card,
  NativeSelect,
  NumberInput,
  Flex,
  NavLink as MantineLink,
} from "@mantine/core";
import Item from "@/types/Item.ts";
import {
  doc,
  updateDoc,
  DocumentReference,
  getDocs,
  getDoc,
  collection,
  QuerySnapshot,
} from "@firebase/firestore";
import { db } from "@/firebase.ts";
import { useQuery, useMutation, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { DocumentData } from "firebase-admin/firestore";

type LoaderDataProps = Item & {
  id: string;
  url: string;
  ref: DocumentReference;
};

const AdminItemsPage = () => {
  const data = useLoaderData() as LoaderDataProps[];
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
  const nullItemRef = doc(db, "bids", "nullItem");
  const updateItem = async (itemRef: DocumentReference) => {
    const docRef = doc(db, "bids", "currentItem");
    return await updateDoc(docRef, {
      ref: itemRef,
      id: itemRef.id,
      amount: 0,
    });
  };
  const getGroups = async () => {
    const groupsRef = collection(db, "groups");
    return await getDocs(groupsRef);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateItem,
  });

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  return (
    <Box>
      <MantineLink component={RouterLink} to="/admin/add_item">
        <Button>Add Item</Button>
      </MantineLink>
      <SimpleGrid
        cols={{
          base: 1,
          md: 3,
          lg: 4,
        }}
      >
        {sortedData &&
          sortedData.map((item) => {
            return RenderItemCard(item, isPending, mutate, nullItemRef, groups);
          })}
      </SimpleGrid>
    </Box>
  );
};

export default AdminItemsPage;

function RenderItemCard(
  item: LoaderDataProps,
  isPending: boolean,
  mutate: (itemRef: DocumentReference) => void,
  nullItemRef: DocumentReference,
  groups: UseQueryResult<QuerySnapshot<DocumentData, DocumentData>, Error>,
) {
  const [bidValue, setBid] = useState<number>(0);

  const handleSubmit = async (bidItem: string) => {
    const docRef = doc(db, "bids", "currentItem");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (bidItem == docSnap.data().id) {
        console.log("in success!");
        await updateDoc(docRef, {
          amount: bidValue,
        });
        return true;
      } else {
        console.log("in fail");
        return false;
      }
    }
  };
  return (
    <Card key={item.id}>
      <Card.Section>
        <Image
          src={item.url}
          alt={item.name}
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
      </Card.Section>

      <h1>{item.name}</h1>
      <Flex>
        <Button
          disabled={isPending}
          onClick={() => {
            mutate(item.ref);
          }}
          style={{ marginRight: "10px" }}
        >
          Start Bid
        </Button>
        <Button
          disabled={isPending}
          onClick={() => {
            mutate(nullItemRef);
          }}
        >
          End Bid
        </Button>
      </Flex>
      {groups.data && (
        <Box>
          <Flex>
            <NativeSelect label={"Group"}>
              {groups.data.docs
                .sort((a, b) => a.data().number - b.data().number)
                .map((group) => {
                  return (
                    <option key={group.id} value={group.id}>
                      {group.data().number}
                    </option>
                  );
                })}
            </NativeSelect>
          </Flex>
          <Flex>
            <NumberInput
              label={"Points to Bid"}
              value={bidValue}
              onChange={(value: string | number) => {
                if (typeof value == "number") {
                  setBid(value);
                }
              }}
            />
          </Flex>
          <Button
            id={item.name}
            style={{ marginTop: "10px" }}
            onClick={() => {
              setBid(0);
              handleSubmit(item.id);
            }}
          >
            Submit Bid
          </Button>
        </Box>
      )}
    </Card>
  );
}
