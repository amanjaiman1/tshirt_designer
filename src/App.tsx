import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { Landing } from "@/routes/Landing";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
