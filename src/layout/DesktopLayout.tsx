import { Outlet } from "react-router-dom";
import "../style.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function DesktopLayout() {
  return (
    <div
      style={{
        minWidth: 1530,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
