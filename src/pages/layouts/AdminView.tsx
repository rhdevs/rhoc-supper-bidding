import { createContext } from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";
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
      <Container maxW={"container.lg"}>
        <Outlet />
      </Container>
    </AdminContext.Provider>
  );
};

export default AdminView;
