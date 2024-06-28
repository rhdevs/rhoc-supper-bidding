import { createContext } from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import { Container } from "@mantine/core";
import { User } from "@firebase/auth";
import AdminNavbar from "@/components/shared/AdminNavbar.tsx";

type LoaderDataProps = {
  user: User;
};

export const AdminContext = createContext<User | null>(null);

const AdminView = () => {
  const loaderData = useLoaderData() as LoaderDataProps;
  const { user } = loaderData;

  return (
    <AdminContext.Provider value={user}>
      <AdminNavbar />
      <Container size={"lg"}>
        <Outlet />
      </Container>
    </AdminContext.Provider>
  );
};

export default AdminView;
