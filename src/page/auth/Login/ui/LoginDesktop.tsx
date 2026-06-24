import "../../../../style.css";
import "../../auth.css";
import useLogin from "../../Hook/useLogin";
import desktopStyle from "../css/LoginDesktop.module.css";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#391B1B"
        d="M9 1.5C4.305 1.5.5 4.477.5 8.143c0 2.357 1.564 4.428 3.92 5.605-.17.638-.617 2.305-.706 2.662-.11.444.163.438.343.319.142-.094 2.262-1.534 3.182-2.16.385.056.78.085 1.184.085 4.695 0 8.5-2.977 8.5-6.643S13.695 1.5 9 1.5z"
      />
    </svg>
  );
}

type LoginForm = {
  loginId: string;
  password: string;
};

const fields: {
  id: keyof LoginForm;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  {
    id: "loginId",
    label: "아이디",
    type: "text",
    placeholder: "아이디를 입력하세요",
  },
  {
    id: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
];

export default function LoginDesktop() {
  const { values, handleChange, handleSubmit, isSubmitting, errors } = useLogin();

  return (
    <div className="container">
      <div className="authContainer">
        <span className="trip-h1">로그인</span>
        <span className={`trip-body1 ${desktopStyle.loginText}`}>
          Trip Baton에 로그인하세요.
        </span>
        <form
          onSubmit={handleSubmit}
          className={`authForm ${desktopStyle.loginForm}`}
          noValidate
        >
          {fields.map(({ id, label, type, placeholder }) => {
            return (
              <div key={id} className="authField">
                <label htmlFor={id}>{label}</label>
                <div className={`authInputBox ${errors[id] ? "inputError" : ""}`}>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={values[id] ?? ""}
                    onChange={(event) => handleChange(id, event.target.value)}
                  />
                </div>
                {errors[id] && <span className="authError">{errors[id]}</span>}
              </div>
            );
          })}
          <button type="submit" className="authBtn" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
          <div className={desktopStyle.divider}>
            <span>또는</span>
          </div>
          <div className={desktopStyle.socialContainer}>
            <button
              type="button"
              className={`${desktopStyle.socialBtn} ${desktopStyle.googleBtn}`}
            >
              <GoogleIcon />
              Google로 로그인
            </button>
            <button
              type="button"
              className={`${desktopStyle.socialBtn} ${desktopStyle.kakaoBtn}`}
            >
              <KakaoIcon />
              Kakao로 로그인
            </button>
          </div>
          <span>
            계정이 없으신가요?<a href="/auth/signup">회원가입</a>
          </span>
        </form>
      </div>
    </div>
  );
}
