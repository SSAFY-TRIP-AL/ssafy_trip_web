import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import signupStyle from "../css/SignUpDesktop.module.css";
import "../../../../style.css";

const fields = [
  { id: "userId", label: "아이디", type: "text", placeholder: "아이디를 입력하세요" },
  { id: "name", label: "이름", type: "text", placeholder: "이름을 입력하세요" },
  { id: "password", label: "비밀번호", type: "password", placeholder: "비밀번호를 입력하세요" },
  { id: "passwordConfirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호를 다시 입력하세요" },
  { id: "email", label: "이메일", type: "email", placeholder: "이메일을 입력하세요" },
  { id: "phone", label: "전화번호", type: "tel", placeholder: "전화번호를 입력하세요" },
];

export default function SignUpDesktop() {
  const [passwordVisible, setPasswordVisible] = useState<Record<string, boolean>>({
    password: false,
    passwordConfirm: false,
  });

  const toggleVisible = (id: string) => {
    setPasswordVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container">
      <div className={signupStyle.signupContainer}>
        <span className="trip-h1">회원가입</span>
        <div className={signupStyle.signupText}>
          <span className="trip-body1">여행 릴레이 서비스에 가입하고 </span>
          <span className="trip-body1">나만의 여행을 시작해보세요. </span>
        </div>
        <form className={signupStyle.signupForm}>
          {fields.map(({ id, label, type, placeholder }) => {
            const isPassword = type === "password";
            const inputType = isPassword && passwordVisible[id] ? "text" : type;

            return (
              <div key={id} className={signupStyle.signupField}>
                <label htmlFor={id}>{label}</label>
                <div className={signupStyle.signupInputBox}>
                  <input id={id} type={inputType} placeholder={placeholder} />
                  {isPassword && (
                    <button
                      type="button"
                      className={signupStyle.signupEyeBtn}
                      onClick={() => toggleVisible(id)}
                    >
                      {passwordVisible[id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button type="submit" className={signupStyle.signupBtn}>
            회원가입
          </button>
          <span>
            이미 계정이 있으신가요?<a href="/login">로그인</a>
          </span>
        </form>
      </div>
    </div>
  );
}
