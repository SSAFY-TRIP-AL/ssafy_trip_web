import { isMobile } from "react-device-detect";
import RelayDetailDesktop from "./ui/RelayDetailDesktop";

export default function RelayDetail() {
  return isMobile ? "" : <RelayDetailDesktop />;
}
