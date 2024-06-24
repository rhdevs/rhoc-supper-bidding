import { NavLink } from "react-router-dom";
import { Flex, Link as ChakraLink } from "@chakra-ui/react";

const AdminNavbar = () => {
  return (
    <Flex gap={"16"} padding={"4"} borderBottom={"1px"} paddingLeft={"20%"}>
      <ChakraLink as={NavLink} to={"/"}>
        Public
      </ChakraLink>
      <ChakraLink as={NavLink} to={"/admin/items"}>
        Items
      </ChakraLink>
      <ChakraLink as={NavLink} to={"/admin/groups"}>
        Groups
      </ChakraLink>
    </Flex>
  );
};

export default AdminNavbar;
