import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { googleLogin, kakaoLogin } from "../api/authApi";
import { getGoogleRedirectUri, getKakaoRedirectUri } from "../Hook/useSocialLogin";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "../../../store/toastStore";
import callbackStyle from "./OAuthCallback.module.css";

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeLogin = useAuthStore((state) => state.login);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam || !code || (provider !== "kakao" && provider !== "google")) {
      toast.error("소셜 로그인에 실패했습니다.");
      navigate("/auth/login", { replace: true });
      return;
    }

    const request = provider === "kakao" ? kakaoLogin : googleLogin;
    const redirectUri = provider === "kakao" ? getKakaoRedirectUri() : getGoogleRedirectUri();

    request({ code, redirectUri })
      .then((data) => {
        toast.success(data.message ?? "로그인되었습니다.");
        storeLogin(data.accessToken, data.name, data.profileImage);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "소셜 로그인에 실패했습니다.");
        navigate("/auth/login", { replace: true });
      });
  }, [provider, searchParams, navigate, storeLogin]);

  return (
    <div className={callbackStyle.container}>
      <span className="trip-body1">로그인 처리 중입니다...</span>
    </div>
  );
}
