import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { Landing } from "@/routes/Landing";

// Code-split the designer (Fabric.js) so it never weighs down the landing
// route's initial JS (ARCHITECTURE §7).
const Designer = lazy(() =>
  import("@/routes/Designer").then((m) => ({ default: m.Designer })),
);

function RouteFallback() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-ink">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
  {
    path: "/design",
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Designer />
      </Suspense>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
