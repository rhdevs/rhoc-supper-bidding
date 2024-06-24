import { DocumentReference } from "@firebase/firestore";

type Users = {
  isAdmin: boolean;
  group: DocumentReference;
};

export default Users;
