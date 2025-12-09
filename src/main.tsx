import { createRoot } from "react-dom/client";
import "@/index.css";

import { RouterProvider } from "react-router";
import { router } from "@/utils/route";
import ThemeProvider from "@/provider/themeProvider";
import { Toaster } from "sonner";
import AuthProvider from "@/provider/authProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <Toaster
        toastOptions={{
          classNames: {
            description: "!text-muted-foreground",
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);
