import { NavLink } from "react-router-dom";
import { NavLink as MantineLink, Flex } from "@mantine/core";

const AdminNavbar = () => {
  return (
    <Flex gap={"16"} className={"p-4 border-b"} >
      <MantineLink component={NavLink} to={"/"} label={"Public"} />
      <MantineLink component={NavLink} to={"/admin/items"} label={"Auctions"} />
      <MantineLink component={NavLink} to={"/admin/groups"} label={"Inventory"} />
    </Flex>
  );
};

export default AdminNavbar;
