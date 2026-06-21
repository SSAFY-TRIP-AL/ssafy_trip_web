import { useEffect, useState } from "react";
import { getMainInfo, type MainInfo } from "../api/mainApi";
import { useNavigate } from "react-router-dom";

export const useMain = () => {
  const [mainInfo, setMainInfo] = useState<MainInfo>({
    userCount: 0,
    relayCount: 0,
    relays: { relays: [] },
    ranking: [],
  });
  const navigate = useNavigate();

  const fetchMainInfo = async () => {
    try {
      const data = await getMainInfo();
      setMainInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMainInfo();
  }, []);

  const goMap = () => {
    navigate("/map");
  };

  return { mainInfo, goMap };
};
