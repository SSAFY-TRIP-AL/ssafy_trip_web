import { useRef } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import mobileStyle from "../css/SignUpMobile.module.css";
import "../../../../style.css";
import "../../auth.css";
import logo from "../../../../assets/logo_lf.svg";
import { usePasswordVisibility } from "../../Hook/usePasswordVisibility";
import { useSignUp } from "../../Hook/useSignUp";

type SignUpForm = {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email: string;
  phone: string;
};

const fields: {
  id: keyof SignUpForm;
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
  { id: "name", label: "이름", type: "text", placeholder: "이름을 입력하세요" },
  {
    id: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
  {
    id: "passwordConfirm",
    label: "비밀번호 확인",
    type: "password",
    placeholder: "비밀번호를 다시 입력하세요",
  },
  {
    id: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력하세요",
  },
  {
    id: "phone",
    label: "전화번호",
    type: "tel",
    placeholder: "전화번호를 입력하세요",
  },
];

export default function SignUpMobile() {
  const {
    values,
    handleChange,
    passwordMismatch,
    profileImagePreview,
    handleProfileImageChange,
    handleSubmit,
  } = useSignUp();
  const { passwordVisible, toggleVisible } = usePasswordVisibility();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={mobileStyle.container}>
      <div className={mobileStyle.authContainer}>
        <img src={logo} alt="Trip Baton" className={mobileStyle.logo} />
        <span className={mobileStyle.tagline}>AI TRAVEL RELAY PLATFORM</span>
        <span className={`trip-h2 ${mobileStyle.title}`}>회원가입</span>
        <div className={mobileStyle.signupText}>
          <span className="trip-body2">Trip Baton에 가입하고 </span>
          <span className="trip-body2">나만의 여행을 시작해보세요. </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`authForm ${mobileStyle.signupForm}`}
        >
          <div className={mobileStyle.avatarField}>
            <div
              className={mobileStyle.avatarUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="프로필 이미지"
                  className={mobileStyle.avatarPreview}
                />
              ) : (
                <div className={mobileStyle.avatarPlaceholder} />
              )}
              <span className={mobileStyle.avatarEditBtn}>
                <Camera size={14} />
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={mobileStyle.avatarInput}
                onChange={(event) =>
                  handleProfileImageChange(event.target.files?.[0] ?? null)
                }
              />
            </div>
          </div>
          {fields.map(({ id, label, type, placeholder }) => {
            const isPassword = type === "password";
            const inputType = isPassword && passwordVisible[id] ? "text" : type;

            return (
              <div key={id} className="authField">
                <label htmlFor={id}>{label}</label>
                <div className={`authInputBox ${mobileStyle.signupInputBox}`}>
                  <input
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={values[id] ?? ""}
                    onChange={(event) => handleChange(id, event.target.value)}
                    required
                  />
                  {isPassword && (
                    <button
                      type="button"
                      className={mobileStyle.signupEyeBtn}
                      onClick={() => toggleVisible(id)}
                    >
                      {passwordVisible[id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  )}
                </div>
                {id === "passwordConfirm" && passwordMismatch && (
                  <span className={mobileStyle.signupFieldError}>
                    비밀번호가 일치하지 않습니다.
                  </span>
                )}
              </div>
            );
          })}
          <button type="submit" className="authBtn">
            회원가입
          </button>
          <span>
            이미 계정이 있으신가요?<a href="/auth/login">로그인</a>
          </span>
        </form>
      </div>
    </div>
  );
}
