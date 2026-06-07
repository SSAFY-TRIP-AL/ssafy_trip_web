import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/DesktopLayout";
import Main from "./page/Main/Main";
import SignUpDesktop from "./page/auth/SignUp/ui/SignUpDesktop";
import LoginDesktop from "./page/auth/Login/ui/LoginDesktop";

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
        <Route path="/auth/signup" element={<SignUpDesktop />} />
        <Route path="/auth/login" element={<LoginDesktop />} />
      </Route>
    </Routes>
  );
}

export default App;
