import { useLoaderData, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Image,
  Card,
  CardHeader,
  CardBody,
  Link
} from "@chakra-ui/react";
import Item from "@/types/Item.ts";
import { doc, updateDoc, DocumentReference } from "@firebase/firestore";
import { db } from "@/firebase.ts";
import { useMutation } from "@tanstack/react-query";

type LoaderDataProps = Item & {
  id: string,
  url: string,
  ref: DocumentReference,
};

const AdminItemsPage = () => {
  const data = useLoaderData() as LoaderDataProps[];
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
  const nullItemRef = doc(db, "bids", "nullItem");
  const updateItem = async (itemRef: DocumentReference) =>  {
    const docRef = doc(db, "bids", "currentItem");
    return await updateDoc(docRef, {
      ref: itemRef,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateItem
  })

  return (
    <Box>
      <Link as={RouterLink} to="/admin/add_item">
        <Button>
          Add Item
        </Button>
      </Link>
      <Button isLoading={isPending} onClick={() => {mutate(nullItemRef)}}>
        End Bid
      </Button>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
      >
        {sortedData &&
          sortedData.map((item) => {
            return (
              <Card key={item.id}>
                <CardHeader>
                  <h1>{item.name}</h1>
                </CardHeader>
                <CardBody>
                  <Image src={item.url} alt={item.name} />
                  <Button isLoading={isPending} onClick={() => {mutate(item.ref)}}>
                    Start Bid
                  </Button>
                </CardBody>
              </Card>
            );
          })}
      </Grid>
    </Box>
  );
};

export default AdminItemsPage;
