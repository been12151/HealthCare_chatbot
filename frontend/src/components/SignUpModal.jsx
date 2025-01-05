import React, { useState } from 'react';
import '../assets/css/SignUpModal.css';

function SignUpModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(''); // 성공 또는 오류 메시지 표시용

  const validateForm = () => {
    const newErrors = {};

    if (!/^[a-zA-Z]{1,10}$/.test(username)) {
      newErrors.username = "유저 이름은 영어로 최대 10글자까지 가능합니다.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{1,9}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "비밀번호는 대문자, 소문자, 숫자를 포함하고 10글자 미만이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const userData = {
          username: username,
          email: email,
          password: password,
        };

        const response = await fetch('http://localhost:5000/auth/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          setMessage("회원가입이 완료되었습니다!");
          setUsername('');
          setEmail('');
          setPassword('');
          onClose();
        } else {
          const errorData = await response.json();
          if (response.status === 409) {
            setErrors({
              ...errors,
              email: errorData.message.includes("이메일") ? "이미 존재하는 이메일입니다." : errors.email,
              username: errorData.message.includes("유저 이름") ? "이미 존재하는 유저 이름입니다." : errors.username,
            });
          } else {
            setMessage(`오류: ${errorData.message || "회원가입에 실패했습니다."}`);
          }
        }
      } catch (error) {
        setMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="signup-modal-overlay" onClick={onClose}>
      <div className="signup-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>회원가입</h2>
        <input
          type="text"
          placeholder="유저 이름"
          className="signup-input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="signup-error-message">{errors.username}</p>}
        
        <input
          type="email"
          placeholder="이메일"
          className="signup-input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="signup-error-message">{errors.email}</p>}
        
        <input
          type="password"
          placeholder="비밀번호"
          className="signup-input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="signup-error-message">{errors.password}</p>}

        <button className="signup-continue-button" onClick={handleSubmit}>회원가입</button>
        {message && <p className={`signup-message ${message.startsWith("오류") ? "error" : ""}`}>{message}</p>}
      </div>
    </div>
  );
}

export default SignUpModal;
