import { Input, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Button, useToast } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase.ts";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      return signInWithEmailAndPassword(
        auth,
        values.username,
        values.password,
      ).then(() => {
        navigate("/admin/bids");
        toast({
          title: "Login Successful",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={"m-6"}>
      <Text fontSize="2xl">RHOC Supper Bidding Admin</Text>
      <label htmlFor={"username"}>Username</label>
      <Input
        placeholder="Username"
        name={"username"}
        id={"username"}
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      <label htmlFor={"password"}>Password</label>
      <Input
        placeholder="Password"
        name={"password"}
        id={"password"}
        type={"password"}
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default AdminLoginPage;
