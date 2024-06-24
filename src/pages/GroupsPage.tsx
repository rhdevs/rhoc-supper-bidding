import { useLoaderData } from "react-router-dom";
import { Grid, Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { QuerySnapshot } from "@firebase/firestore";
import Group from "@/types/Group.ts";

const GroupsPage = () => {
  const data = useLoaderData() as QuerySnapshot<Group>;
  const sortedData = data.docs.sort((a, b) => a.data().number - b.data().number);
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={6}
      >
      {
        sortedData && sortedData.map((group) => {
          return (
            <Card key={group.id}>
              <CardHeader>
                {group.data().number}
              </CardHeader>
              <CardBody>
                <Text>Points: {group.data().points}</Text>
              </CardBody>
            </Card>
          )
        })
      }
    </Grid>
  );
}

export default GroupsPage;