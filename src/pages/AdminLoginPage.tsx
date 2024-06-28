import { Button, TextInput, PasswordInput, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFormik } from "formik";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase.ts";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();

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
        navigate("/admin/items");
        notifications.show({
          title: "Login Successful",
          message: "You have successfully logged in",
          color: "teal",
        });
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={"m-6"}>
      <Text size="xl">RHOC Supper Bidding Admin</Text>
      <label htmlFor={"username"}>Username</label>
      <TextInput
        placeholder="Username"
        name={"username"}
        id={"username"}
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      <label htmlFor={"password"}>Password</label>
      <PasswordInput
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
