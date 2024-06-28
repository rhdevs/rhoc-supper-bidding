import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import router from "@/router.ts";
import "@/assets/css/reset.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);
