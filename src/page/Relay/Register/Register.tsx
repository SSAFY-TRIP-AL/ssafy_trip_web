import { isMobile } from "react-device-detect";
import RegisterDesktop from "./ui/RegisterDesktop";

export default function Register() {
  return isMobile ? "" : <RegisterDesktop />;
}
