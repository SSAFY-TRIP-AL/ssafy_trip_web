import { isMobile } from "react-device-detect";
import MainDesktop from "./ui/MainDesktop";
import MainMobile from "./ui/MainMobile";

export default function Main() {
  return isMobile ? <MainMobile /> : <MainDesktop />;
}
