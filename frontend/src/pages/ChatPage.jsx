// ChatPage.jsx
import React, { useState } from 'react';
import '../assets/css/ChattingPage.css';
import LoginModal from '../components/LoginModal';

import recentIcon from '../assets/images/recent.png';
import settingIcon from '../assets/images/Settings.png';
import mypageIcon from '../assets/images/MyPage.png';
import helpIcon from '../assets/images/Help.png';
import searchIcon from '../assets/images/search.png';

function ChatPage({ isLoggedIn, onLogout }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [sequence, setSequence] = useState(1);  

    const handleSend = async () => {
        if (inputValue.trim() === '') return;

        
        setMessages([...messages, { sender: 'user', text: inputValue }]);
        const userMessage = inputValue;
        setInputValue('');

        try {
          
            const response = await fetch('http://localhost:5000/apis/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: userMessage,
                    sequence: sequence  
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data) 
                    
                
                const botResponse = Array.isArray(data.output)
                ? data.output.join(' ').replace(/\n/g, '<br />')
                : data.output.replace(/\n/g, '<br />');
            
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', text: botResponse }
            ]);

                
                setSequence(prevSequence => prevSequence + 1);
            } else {
                console.error('서버 응답 오류:', response.statusText);
            }
        } catch (error) {
            console.error('서버 요청 중 오류 발생:', error);
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
                        <img src={recentIcon} alt="recent" style={{ float: 'left', marginRight: '1rem' }} />
                        불면증에 좋은 약이나 음식
                    </div>
                </div>
                <nav className="settings">
                    <p><img src={settingIcon} alt="" className="settingsIcon" /> Settings</p>
                    <p><img src={mypageIcon} alt="" className="settingsIcon" /> My page</p>
                    <p><img src={helpIcon} alt="" className="settingsIcon" /> Help</p>
                </nav>
            </aside>

            <main className="main">
                <header className="header">
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={onLogout}>
                            LOG OUT
                        </button>
                    ) : (
                        <button className="login-button" onClick={() => setIsModalOpen(true)}>
                            LOG IN
                        </button>
                    )}
                </header>

                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div
                        key={index}
                        className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                        ></div>
                    ))}
                </div>

                <footer className="footer">
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="상담이 필요한 내용을 입력하세요."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <img src={searchIcon} alt="" className="search-icon" onClick={handleSend} />
                    </div>
                </footer>
            </main>

            {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} onLoginSuccess={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default ChatPage;
