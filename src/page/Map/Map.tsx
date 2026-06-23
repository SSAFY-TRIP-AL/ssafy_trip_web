import { isMobile } from "react-device-detect";
import MapDesktop from "./ui/MapDesktop";
import MapMobile from "./ui/MapMobile";

export default function Map() {
  return isMobile ? <MapMobile /> : <MapDesktop />;
}
