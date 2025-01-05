import React, { useState } from 'react';
import SignUpModal from './SignUpModal';
import '../assets/css/LoginModal.css';

function LoginModal({ onClose, onLoginSuccess }) { // onLoginSuccess 콜백 추가
  const [signUpModal, setSignUpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 로그인 실패 메시지 표시용

  const openSignUpModal = (e) => {
    e.preventDefault();
    setSignUpModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage("로그인 성공!");
        onLoginSuccess(); // 로그인 성공 시 호출
        onClose(); // 모달 닫기
      } else {
        const errorData = await response.json();
        setErrorMessage(`로그인 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>LOG IN</h2>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="continue-button" onClick={handleLogin}>CONTINUE</button>
          <p>Or</p>
          <p className="signup-link">
            New User? <a href="#" onClick={openSignUpModal}>SIGN UP HERE</a>
          </p>
        </div>
      </div>
      {signUpModal && <SignUpModal onClose={() => setSignUpModal(false)} />}
    </>
  );
}

export default LoginModal;
