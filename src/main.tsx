import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router/index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const clinet = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={clinet}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>
);
