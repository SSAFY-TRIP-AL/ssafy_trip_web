import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ReissueResponse {
  message?: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // 액세스 토큰 만료
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        // 액세스 토큰 갱신 요청
        const res = await axios.post<string>(
          `${BASE_URL}/auth/reissue`,
          {},
          { withCredentials: true },
        );
        if (res.status === 200) {
          const newAccessToken = res.data;
          const { setAccessToken } = useAuthStore.getState();
          setAccessToken(newAccessToken);

          // 새 액세스 토큰으로 원래 요청 다시 보내기
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          const reissueData = res.data as unknown as ReissueResponse;
          console.error("토큰 갱신 실패");
          toast.error(
            reissueData.message ??
              "세션이 만료되었습니다. 다시 로그인해주세요.",
          );
        }
      } catch {
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error); //또 error이면 인터셉터 호출한 곳에서 에러처리 하도록!
  },
);

export default api;
