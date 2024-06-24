import { useToast, Input, Button, Box } from "@chakra-ui/react";
import { useFormik } from "formik";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/firebase.ts";
import Item from "@/types/Item.ts";

const AdminAddItemPage = () => {
  const toast = useToast();
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
          toast({
            title: "Item uploaded successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          navigate("/admin/items");
        })
        .catch((error) => {
          toast({
            title: "Error uploading item",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    },
  });

  return (
    <Box>
      <h1>Add New Bid Item</h1>
      <form onSubmit={formik.handleSubmit}>
        <Input
          type="file"
          name="file"
          accept={"image/*"}
          required={true}
          onChange={(event) => {
            if (event.currentTarget.files) {
              formik.setFieldValue("file", event.currentTarget.files[0]);
            }
          }}
        />
        <Input
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
