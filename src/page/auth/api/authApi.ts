export interface SignUpRequest {
  id: string;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signUp = async (payload: SignUpRequest) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
