import { isMobile } from "react-device-detect";
import SignUpDesktop from "./ui/SignUpDesktop";
export default function SignUp() {
  return isMobile ? "" : <SignUpDesktop />;
}
