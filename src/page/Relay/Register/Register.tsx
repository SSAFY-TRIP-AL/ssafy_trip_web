import { isMobile } from "react-device-detect";
import RegisterDesktop from "./ui/RegisterDesktop";
import RegisterMobile from "./ui/RegisterMobile";

export default function Register() {
  return isMobile ? <RegisterMobile /> : <RegisterDesktop />;
}
