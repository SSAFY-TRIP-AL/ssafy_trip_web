import { isMobile } from "react-device-detect";
import RelayListDesktop from "./ui/RelayListDesktop";
import RelayListMobile from "./ui/RelayListMobile";

export default function RelayList() {
  return isMobile ? <RelayListMobile /> : <RelayListDesktop />;
}
