import { useLoaderData } from "react-router-dom";
import { SimpleGrid, Card, Text } from "@mantine/core";
import { QuerySnapshot } from "@firebase/firestore";
import Group from "@/types/Group.ts";

const GroupsPage = () => {
  const data = useLoaderData() as QuerySnapshot<Group>;
  const sortedData = data.docs.sort(
    (a, b) => a.data().number - b.data().number,
  );
  return (
    <SimpleGrid
      cols={{
        base: 1,
        md: 3,
        lg: 4,
      }}
    >
      {sortedData &&
        sortedData.map((group) => {
          return (
            <Card key={group.id}>
              <Text>{group.data().number}</Text>
              <Text>Points: {group.data().points}</Text>
            </Card>
          );
        })}
    </SimpleGrid>
  );
};

export default GroupsPage;
