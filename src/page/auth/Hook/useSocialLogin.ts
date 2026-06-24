const KAKAO_CLIENT_ID = import.meta.env.VITE_KKAKO_REST_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const getKakaoRedirectUri = () => `${window.location.origin}/auth/kakao/callback`;
export const getGoogleRedirectUri = () => `${window.location.origin}/auth/google/callback`;

export function useSocialLogin() {
  const loginWithKakao = () => {
    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: getKakaoRedirectUri(),
      response_type: "code",
    });
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };

  const loginWithGoogle = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: getGoogleRedirectUri(),
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return { loginWithKakao, loginWithGoogle };
}
