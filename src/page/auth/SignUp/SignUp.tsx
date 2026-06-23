import { isMobile } from "react-device-detect";
import SignUpDesktop from "./ui/SignUpDesktop";
import SignUpMobile from "./ui/SignUpMobile";
export default function SignUp() {
  return isMobile ? <SignUpMobile /> : <SignUpDesktop />;
}
