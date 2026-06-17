import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * Global shell wrapping every route: smooth scroll, grain texture, custom
 * cursor, sticky header and footer. Route content renders in <Outlet />.
 */
export function RootLayout() {
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <GrainOverlay />
      <CustomCursor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
