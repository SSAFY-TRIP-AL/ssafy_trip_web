import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { isMobile } from "react-device-detect";
import DesktopLayout from "./layout/DesktopLayout";
import MobileLayout from "./layout/MobileLayout";
import Main from "./page/Main/Main";
import SignUp from "./page/auth/SignUp/SignUp";
import Login from "./page/auth/Login/Login";
import Map from "./page/Map/Map";
import RelayList from "./page/Relay/List/RelayList";
import RelayDetail from "./page/Relay/Detail/RelayDetail";
import Register from "./page/Relay/Register/Register";
import MyPage from "./page/MyPage/MyPage";
import RequireAuth from "./components/RequireAuth/RequireAuth";

function App() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };

    setVh(); // 초기 실행
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <Routes>
      <Route path="/" element={isMobile ? <MobileLayout /> : <DesktopLayout />}>
        <Route index element={<Main />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/map" element={<Map />} />
          <Route path="/relay/list" element={<RelayList />} />
          <Route path="/relay/detail/:id" element={<RelayDetail />} />
          <Route path="/relay/register" element={<Register />} />
          <Route path="/relay/:id/step" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
