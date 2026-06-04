import { Outlet } from "react-router-dom";
import "../css/style.css";
import Header from "../components/Header";

export default function GlobalLayout() {
  return (
    <>
      <Header />
      <div className="layoutContainer">
        <Outlet />
      </div>
    </>
  );
}
