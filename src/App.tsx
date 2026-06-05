import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import GlobalLayout from "./layout/DesktopLayout";
import Index from "./page/Main/Main";
import SignUpDesktop from "./page/auth/SignUp/ui/SignUpDesktop";

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
      <Route path="/" element={<GlobalLayout />}>
        <Route index element={<Index />} />
        <Route path="/auth/signup" element={<SignUpDesktop />} />
      </Route>
    </Routes>
  );
}

export default App;
