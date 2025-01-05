// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBotPage from './pages/ChatBotPage';
import ChatPage from './pages/ChatPage';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // 로그인 상태 업데이트
    setIsModalOpen(false); // 로그인 모달 닫기
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
      });

      if (response.ok) {
        setIsLoggedIn(false); // 로그아웃 성공 시 상태 업데이트
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ChatBotPage
              isLoggedIn={isLoggedIn}
              onLogin={() => setIsModalOpen(true)}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <ChatPage
              isLoggedIn={isLoggedIn}
              onLogin={() => setIsModalOpen(true)}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>

      {isModalOpen && (
        <LoginModal onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </Router>
  );
}

export default App;
