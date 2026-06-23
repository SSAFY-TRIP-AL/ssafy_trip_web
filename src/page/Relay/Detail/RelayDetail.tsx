import { isMobile } from "react-device-detect";
import RelayDetailDesktop from "./ui/RelayDetailDesktop";
import RelayDetailMobile from "./ui/RelayDetailMobile";

export default function RelayDetail() {
  return isMobile ? <RelayDetailMobile /> : <RelayDetailDesktop />;
}
