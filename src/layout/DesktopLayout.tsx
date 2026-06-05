import { Outlet } from "react-router-dom";
import "../style.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function DesktopLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
