import { Eye, EyeOff } from "lucide-react";
import { useState, type SubmitEventHandler } from "react";
import desktopStyle from "../css/SignUpDesktop.module.css";
import "../../../../style.css";
import "../../auth.css";
import { useNavigate } from "react-router-dom";

const fields = [
  {
    id: "userId",
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

export default function SignUpDesktop() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [passwordVisible, setPasswordVisible] = useState<
    Record<string, boolean>
  >({
    password: false,
    passwordConfirm: false,
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const toggleVisible = (id: string) => {
    setPasswordVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const passwordMismatch =
    Boolean(values.passwordConfirm) &&
    values.password !== values.passwordConfirm;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (passwordMismatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formData = {
      id: values.userId,
      name: values.name,
      password: values.password,
      email: values.email,
      phoneNumber: values.phone,
    };
    console.log(formData);

    try {
      const response = await fetch(BASE_URL + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/auth/login");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="authContainer">
        <span className="trip-h1">회원가입</span>
        <div className={desktopStyle.signupText}>
          <span className="trip-body1">Trip Baton에 가입하고 </span>
          <span className="trip-body1">나만의 여행을 시작해보세요. </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`authForm ${desktopStyle.signupForm}`}
        >
          {fields.map(({ id, label, type, placeholder }) => {
            const isPassword = type === "password";
            const inputType = isPassword && passwordVisible[id] ? "text" : type;

            return (
              <div key={id} className="authField">
                <label htmlFor={id}>{label}</label>
                <div className={`authInputBox ${desktopStyle.signupInputBox}`}>
                  <input
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={values[id] ?? ""}
                    onChange={(event) => handleChange(id, event.target.value)}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      className={desktopStyle.signupEyeBtn}
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
                  <span className={desktopStyle.signupFieldError}>
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
            이미 계정이 있으신가요?<a href="/login">로그인</a>
          </span>
        </form>
      </div>
    </div>
  );
}
