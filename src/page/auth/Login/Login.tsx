import { isMobile } from "react-device-detect";
import LoginDesktop from "./ui/LoginDesktop";
export default function Login() {
  return isMobile ? "" : <LoginDesktop />;
}
