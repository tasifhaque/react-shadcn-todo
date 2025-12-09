import { createBrowserRouter } from "react-router";
import App from "@/App.tsx";
import { SigninPage } from "@/page/logIn";
import SignupPage from "@/page/signUp";
import Auth from "@/page/auth";
import ProtectedPage from "@/page/protectedPage";
import Dashboard from "@/page/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <App />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth/signin",
        element: <SigninPage />,
      },
      {
        path: "/auth/signup",
        element: <SignupPage />,
      },
    ],
  },
]);
