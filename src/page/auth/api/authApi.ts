export interface SignUpRequest {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SocialLoginRequest {
  code: string;
  redirectUri: string;
}

export interface SocialLoginResponse {
  accessToken: string;
  name: string;
  profileImage: string;
  message?: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signUp = async (payload: SignUpRequest) => {
  console.log(payload);
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
export const login = async (payload: LoginRequest) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

export const kakaoLogin = async (
  payload: SocialLoginRequest,
): Promise<SocialLoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/kakao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

export const googleLogin = async (
  payload: SocialLoginRequest,
): Promise<SocialLoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
