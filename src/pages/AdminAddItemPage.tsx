import { FileInput, TextInput, Button, Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFormik } from "formik";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { nanoid } from "nanoid"; // this is to scramble the file naming to avoid conflicts and XSS attacks
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/firebase.ts";
import Item from "@/types/Item.ts";

const AdminAddItemPage = () => {
  const navigate = useNavigate();
  const formik = useFormik<{ file: File | null; name: string }>({
    initialValues: {
      file: null,
      name: "",
    },
    onSubmit: (values) => {
      // Handle file upload here
      if (!values.file || !values.name) {
        return;
      }
      const fileExtension = values.file.name.split(".").pop();
      const storageRef = ref(storage, `items/${nanoid()}.${fileExtension}`);
      uploadBytes(storageRef, values.file)
        .then(({ ref }) => {
          const newItem: Item = {
            name: values.name,
            storageUrl: ref.toString(),
          };
          return addDoc(collection(db, "items"), newItem);
        })
        .then(() => {
          notifications.show({
            title: "Item uploaded successfully",
            message: "",
            color: "teal",
          });
          navigate("/admin/items");
        })
        .catch((error) => {
          notifications.show({
            title: "Error uploading item",
            message: error.message,
            color: "red",
          });
        });
    },
  });

  return (
    <Box>
      <h1>Add New Bid Item</h1>
      <form onSubmit={formik.handleSubmit}>
        <FileInput
          name="file"
          accept={"image/*"}
          required={true}
          onChange={(file) => {
            formik.setFieldValue("file", file);
          }}
        />
        <TextInput
          type={"text"}
          name={"name"}
          placeholder={"Name"}
          onChange={formik.handleChange}
          value={formik.values.name}
          required={true}
        />
        <Button type="submit">Upload</Button>
      </form>
    </Box>
  );
};

export default AdminAddItemPage;
