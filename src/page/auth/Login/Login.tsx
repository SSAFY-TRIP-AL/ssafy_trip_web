import { isMobile } from "react-device-detect";
import LoginDesktop from "./ui/LoginDesktop";
import LoginMobile from "./ui/LoginMobile";
export default function Login() {
  return isMobile ? <LoginMobile /> : <LoginDesktop />;
}
