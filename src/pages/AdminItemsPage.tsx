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
} from "@mantine/core";
import Item from "@/types/Item.ts";
import {
  doc,
  updateDoc,
  DocumentReference,
  getDocs,
  getDoc,
  collection,
} from "@firebase/firestore";
import { db } from "@/firebase.ts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type LoaderDataProps = Item & {
  id: string;
  url: string;
  ref: DocumentReference;
};

const AdminItemsPage = () => {
  const { data: currentUser, isLoading } = useAuth();

  const data = useLoaderData() as LoaderDataProps[];
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  const [userSnap, setUserSnap] = useState<unknown>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userUid = currentUser.uid;
        const userRef = doc(db, "users", userUid);
        const userSnapshot = await getDoc(userRef);
        setUserSnap(userSnapshot.data());
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      {/* <MantineLink component={RouterLink} to="/admin/add_item">
        <Button>Add Item</Button>
      </MantineLink> */}
      <Button
        component={RouterLink}
        to="/admin/add_item"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Add Item
      </Button>
      <SimpleGrid
        cols={{
          base: 1,
          md: 3,
          lg: 4,
        }}
      >
        {sortedData &&
          sortedData.map((item) => {
            return (
              <RenderItemCard key={item.id} item={item} userSnap={userSnap} />
            );
          })}
      </SimpleGrid>
    </Box>
  );
};

export default AdminItemsPage;

const RenderItemCard = ({
  item,
  userSnap,
}: {
  item: LoaderDataProps;
  userSnap: unknown;
}) => {
  const nullItemRef = doc(db, "bids", "nullItem");

  const updateItem = async (itemRef: DocumentReference) => {
    const docRef = doc(db, "bids", "currentItem");
    return await updateDoc(docRef, {
      ref: itemRef,
      id: itemRef.id,
      amount: 0,
      user: userSnap,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateItem,
  });

  const getGroups = async () => {
    const groupsRef = collection(db, "groups");
    return await getDocs(groupsRef);
  };

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const [bidValue, setBid] = useState<number>(0);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleBid = (process: string, itemRef: DocumentReference) => {
    if (process == "start") {
      console.log("handling start bid item: " + item.id);
      console.log("Active item id: " + activeItemId);
      if (activeItemId == null) {
        mutate(itemRef);
        setActiveItemId(item.id);
        console.log("Active item id: " + activeItemId);
      }
    }

    if (process == "end") {
      console.log("handling end bid item: " + item.id);
      console.log("Active item id: " + activeItemId);
      if (item.id == activeItemId) {
        mutate(nullItemRef);
        setActiveItemId(null);
      }
    }
  };

  const handleSubmit = async (bidItem: string) => {
    const docRef = doc(db, "bids", "currentItem");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentAmount = docSnap.data().amount;
      if (bidItem == docSnap.data().id && bidValue > currentAmount) {
        console.log("Submit bid success!");
        await updateDoc(docRef, {
          amount: bidValue,
        });
        return true;
      } else {
        console.log("Submit bid fail");
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
            handleBid("start", item.ref);
          }}
          style={{ marginRight: "10px" }}
        >
          Start Bid
        </Button>
        <Button
          disabled={isPending}
          onClick={() => {
            handleBid("end", item.ref);
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
              handleSubmit(item.id);
              setBid(0);
            }}
          >
            Submit Bid
          </Button>
        </Box>
      )}
    </Card>
  );
};
