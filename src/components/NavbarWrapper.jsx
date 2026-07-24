"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";

  if (hideNavbar) return null;

  // White text only on homepage (has hero background image)
  // Dark text on all other pages
  const theme = pathname === "/" ? "light" : "dark";

  return <Navbar theme={theme} />;
}
