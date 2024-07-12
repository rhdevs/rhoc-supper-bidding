import { createBrowserRouter } from "react-router-dom";
import { signOut } from "firebase/auth";
import { redirect } from "react-router-dom";

import Index from "@/pages/Index";
import AdminView from "@/pages/layouts/AdminView.tsx";
import AdminLoginPage from "@/pages/AdminLoginPage.tsx";
import AdminItemsPage from "@/pages/AdminItemsPage.tsx";
import AdminAddItemPage from "@/pages/AdminAddItemPage.tsx";
import { auth } from "@/firebase.ts";

import { getCurrentItem } from "@/api/index/index.ts";
import { getItems } from "@/api/admin/items_show.ts";
import { getGroups } from "@/api/groups/groups.ts";
import {
  getAdminAlreadyLoggedIn,
  getAdminStatus,
} from "@/api/authentication/admin.ts";
import GroupsPage from "@/pages/GroupsPage.tsx";
import AdminSignupPage from "./pages/AdminSignupPage";

const logout = async () => {
  return await signOut(auth).then(() => redirect("/admin/login"));
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
    loader: getCurrentItem,
  },
  {
    path: "signup",
    Component: AdminSignupPage,
    // loader: signupAdmin,
  },
  {
    path: "/admin",
    Component: AdminView,
    loader: getAdminStatus,
    children: [
      {
        path: "items",
        Component: AdminItemsPage,
        loader: getItems,
      },
      {
        path: "add_item",
        Component: AdminAddItemPage,
      },
      {
        path: "groups",
        Component: GroupsPage,
        loader: getGroups,
      },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLoginPage,
    loader: getAdminAlreadyLoggedIn,
  },
  {
    path: "/admin/logout",
    loader: logout,
  },
]);

export default router;
