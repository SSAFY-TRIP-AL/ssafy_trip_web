import { isMobile } from "react-device-detect";
import MapDesktop from "./ui/MapDesktop";

export default function Map() {
  return isMobile ? "" : <MapDesktop />;
}
