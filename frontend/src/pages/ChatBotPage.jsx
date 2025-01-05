// ChatBotPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/ChatBotPage.css';
import LoginModal from '../components/LoginModal';

import recentIcon from '../assets/images/recent.png';
import settingIcon from '../assets/images/Settings.png';
import mypageIcon from '../assets/images/MyPage.png';
import helpIcon from '../assets/images/Help.png';
import searchIcon from '../assets/images/search.png';
import mainIcon1 from '../assets/images/icon1.png';
import mainIcon2 from '../assets/images/icon2.png';
import mainIcon3 from '../assets/images/icon3.png';
import mainIcon4 from '../assets/images/icon4.png';

function ChatBotPage({ isLoggedIn, onLogin, onLogout }) {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    if (inputValue.trim() !== '') {
      const queryData = {
        query: inputValue,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch('http://localhost:5000/apis/chat', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryData),
        });

        if (response.ok) {
          console.log('Query sent successfully');
          navigate('/chat', { state: { initialMessage: inputValue } });
        } else {
          console.error('Failed to send query');
        }
      } catch (error) {
        console.error('Error sending query:', error);
      }
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo" onClick={() => window.location.href = '/'}>LOGO</div>
        <button className="new-chat" onClick={() => window.location.href = '/'}>+ New Chat</button>
        <div className="recent">
          <p>Recent</p>
          <div className="recent-item" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={recentIcon} alt="recent" style={{ float: 'left', marginRight: '1rem' }}></img>
            불면증에 좋은 약이나 음식
          </div>
        </div>
        <nav className="settings">
          <p>
            <img src={settingIcon} alt="" className="settingsIcon" />
            Settings
          </p>
          <p>
            <img src={mypageIcon} alt="" className="settingsIcon" />
            My page
          </p>
          <p>
            <img src={helpIcon} alt="" className="settingsIcon" />
            Help
          </p>
        </nav>
      </aside>

      <main className="main">
        <h1>NEW FRONTEND</h1>
        <p>반갑습니다. 무엇을 도와드릴까요?</p>

        <header className="header">
          {isLoggedIn ? (
            <button className="logout-button" onClick={onLogout}>
              LOG OUT
            </button>
          ) : (
            <button className="login-button" onClick={onLogin}>
              LOG IN
            </button>
          )}
        </header>

        <section className="options">
          <div className="option">
            <img src={mainIcon1} alt=""></img>
            <p>의료 상담</p>
          </div>
          <div className="option">
            <img src={mainIcon2} alt=""></img>
            <p>건강관리 팁</p>
          </div>
          <div className="option">
            <img src={mainIcon3} alt=""></img>
            <p>약물 정보</p>
          </div>
          <div className="option">
            <img src={mainIcon4} alt=""></img>
            <p>응급 상황 대처</p>
          </div>
        </section>

        <footer className="footer">
          <div className="input-container">
            <input
              type="text"
              placeholder="상담이 필요한 내용을 입력하세요."
              value={inputValue}
              onChange={handleInputChange}
            />
            <img
              src={searchIcon}
              alt=""
              className="search-icon"
              onClick={handleSearch}
            />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default ChatBotPage;
