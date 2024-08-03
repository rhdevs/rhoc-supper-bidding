import { useLoaderData, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  SimpleGrid,
  Image,
  Card,
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
import { DocumentData } from "firebase-admin/firestore";
import Group from "@/types/Group";
import { notifications } from "@mantine/notifications";

type LoaderDataProps = Item & {
  id: string;
  url: string;
  ref: DocumentReference;
};

const AdminItemsPage = () => {
  const { data: currentUser, isLoading } = useAuth();

  const data = useLoaderData() as LoaderDataProps[];
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  const [userSnap, setUserSnap] = useState<DocumentData>();

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

  if (isLoading || userSnap == undefined) {
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
  userSnap: DocumentData;
}) => {
  const nullItemRef = doc(db, "bids", "nullItem");

  // update currentItem in 'bids' + mutation function
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

  // get all groups and numbers to be displayed in RenderItemCard Components
  const getGroups = async () => {
    const groupsRef = collection(db, "groups");
    return await getDocs(groupsRef);
  };

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  // get group of current user
  const getGroup = async (): Promise<Group> => {
    if (!userSnap.group) {
      throw new Error("Group not found in user data");
    }
    const groupId = userSnap.group.id;
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);
    return groupDoc.data() as Group;
  };

  //groupQuery.data has 2 fields, one is number and one is points
  const groupQuery = useQuery({
    queryKey: ["group", userSnap.group.id],
    queryFn: getGroup,
    enabled: !!userSnap.group,
  });

  const updateGroupPoints = async (groupId: string, pointsToReduce: number) => {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    console.log(pointsToReduce);

    if (groupSnap.exists()) {
      const currentPoints = groupSnap.data().points;
      console.log(currentPoints);

      if (currentPoints < pointsToReduce) {
        console.error("Not enough points to reduce");
        return false;
      }

      await updateDoc(groupRef, {
        points: currentPoints - pointsToReduce,
      });
      console.log("Group points updated successfully!");
      return true;
    } else {
      console.error("Group not found");
      return false;
    }
  };

  const [bidValue, setBid] = useState<number>(
    localStorage.getItem("bidValue")
      ? Number(localStorage.getItem("bidValue"))
      : 0,
  );
  const [activeItemId, setActiveItemId] = useState<string | null>(
    localStorage.getItem("activeItemId"),
  );

  // start and endbid process, use update current item function
  const handleBid = async (process: string, itemRef: DocumentReference) => {
    if (process == "start") {
      console.log("Handling start bid item: " + item.id);
      console.log("Active item id: " + activeItemId);
      if (activeItemId == null) {
        mutate(itemRef);
        setActiveItemId(item.id);
        localStorage.setItem("activeItemId", item.id);
        localStorage.setItem("bidValue", bidValue.toString());
        notifications.show({
          title: "Success",
          message: "Bid has been started successfully!",
          color: "teal",
        });
      }
    }

    if (process == "end") {
      console.log("Handling end bid item: " + item.id);
      console.log("Active item id: " + activeItemId);
      setBid(Number(localStorage.getItem("bidValue")));

      if (userSnap.group && groupQuery.data) {
        console.log(bidValue);
        const success = await updateGroupPoints(userSnap.group.id, bidValue);
        if (!success) {
          console.error("Failed to update group points");
        }
      }

      if (item.id == activeItemId) {
        mutate(nullItemRef);
        setActiveItemId(null);
        localStorage.removeItem("activeItemId");
        localStorage.removeItem("bidValue");
        console.log(bidValue);
        notifications.show({
          title: "Success",
          message: "Bid has been ended successfully!",
          color: "green",
        });
      }
      setBid(0);
    }
  };

  // handle submit bid process by any user
  const handleSubmit = async (bidItem: string) => {
    const docRef = doc(db, "bids", "currentItem");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && groupQuery.data) {
      const currentAmount = docSnap.data().amount;
      if (
        bidItem == docSnap.data().id &&
        bidValue > currentAmount &&
        bidValue < groupQuery.data.points
      ) {
        localStorage.setItem("bidValue", bidValue.toString());
        await updateDoc(docRef, {
          ref: item.ref,
          id: item.ref.id,
          amount: bidValue,
          user: userSnap,
        });
        notifications.show({
          title: "Success",
          message: "Bid submitted successfully!",
          color: "green",
        });
        return true;
      } else {
        console.log("Submit bid fail");
        setBid(0);
        localStorage.removeItem("bidValue");
        notifications.show({
          title: "Error",
          message: "Failed to submit bid.",
          color: "red",
        });
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

      <h1 style={{ marginTop: "10px", fontWeight: "bold" }}>{item.name}</h1>
      <Flex style={{ marginTop: "5px" }}>
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
          <Flex style={{ marginTop: "10px", marginBottom: "10px" }}>
            <h2>Group</h2>
            {/* <NativeSelect label={"Group"}>
              {groups.data.docs
                .sort((a, b) => a.data().number - b.data().number)
                .map((group) => {
                  return (
                    <option key={group.id} value={group.id}>
                      {group.data().number}
                    </option>
                  );
                })}
            </NativeSelect> */}
            <p style={{ marginLeft: "5px" }}>{groupQuery.data?.number}</p>
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
            }}
          >
            Submit Bid
          </Button>
        </Box>
      )}
    </Card>
  );
};
