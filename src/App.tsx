import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/DesktopLayout";
import Main from "./page/Main/Main";
import SignUp from "./page/auth/SignUp/SignUp";
import Login from "./page/auth/Login/Login";
import Map from "./page/Map/Map";
import RelayList from "./page/Relay/List/RelayList";
import RelayDetail from "./page/Relay/Detail/RelayDetail";
import Register from "./page/Relay/Register/Register";
import MyPage from "./page/MyPage/MyPage";

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
        <Route path="/relaylist" element={<RelayList />} />
        <Route path="/relaydetail/:id" element={<RelayDetail />} />
        <Route path="/relayregister" element={<Register />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
