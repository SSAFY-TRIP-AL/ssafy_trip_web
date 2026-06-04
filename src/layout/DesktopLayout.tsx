import { Outlet } from "react-router-dom";
import "../style.css";
import Header from "../components/Header/Header";

export default function DesktopLayout() {
  return (
    <>
      <Header />
      <div className="layoutContainer">
        <Outlet />
      </div>
    </>
  );
}
