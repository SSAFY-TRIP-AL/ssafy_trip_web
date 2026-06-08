import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/DesktopLayout";
import Main from "./page/Main/Main";
import SignUp from "./page/auth/SignUp/SignUp";
import Login from "./page/auth/Login/Login";
import Map from "./page/Map/Map";

function App() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };

    setVh(); // 초기 실행
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<DesktopLayout />}>
        <Route index element={<Main />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
      </Route>
    </Routes>
  );
}

export default App;
