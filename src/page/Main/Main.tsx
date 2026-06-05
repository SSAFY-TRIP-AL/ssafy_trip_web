import { isMobile } from "react-device-detect";
import MainDesktop from "./ui/MainDesktop";

export default function Main() {
  return isMobile ? "" : <MainDesktop />;
}
