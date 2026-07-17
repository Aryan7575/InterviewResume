import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/Login";
import Register from "./Features/auth/pages/Register";
import Home from "./Features/interview/pages/Home";
import Interview from "./Features/interview/pages/Interview";
import Protected from "./Features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path:"/",
    element:<Protected><Home /></Protected>
  },
  {
    path:"/interview/:interviewId",
    element:<Protected><Interview /></Protected>
  }
]);