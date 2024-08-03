import { Button, TextInput, PasswordInput, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase.ts";
import { useNavigate } from "react-router-dom";

const AdminSignupPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      return createUserWithEmailAndPassword(
        auth,
        values.username,
        values.password,
      ).then(() => {
        navigate("/admin/login");
        notifications.show({
          title: "Account creation successful",
          message: "You have successfully created your account, login now!",
          color: "teal",
        });
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={"m-6"}>
      <Text size="xl">Create RHOC Supper Bidding Admin</Text>
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
      <Button type="submit">Signup</Button>
    </form>
  );
};

export default AdminSignupPage;
