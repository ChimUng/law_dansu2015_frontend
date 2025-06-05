// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Topbar from './components/Topbar';
import ChatSection from './components/Chatsection'; // Đảm bảo tên file đúng chữ hoa chữ thường
import Notification from './components/Notification';

import './App.css'; // Import file CSS

function App() {
const [session, setSession] = useState(null);
const [question, setQuestion] = useState('');
// Thay đổi state để lưu lịch sử chat dưới dạng mảng các tin nhắn
const [history, setHistory] = useState([]);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showNotification, setShowNotification] = useState(false);

// Xử lý session đăng nhập
useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
}, []);

const handleLoginWithGoogle = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: 'http://localhost:3000', // Đảm bảo đúng địa chỉ redirect
    },
    });
    if (error) setError('Lỗi đăng nhập Google: ' + error.message);
};

const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setHistory([]); // Xóa lịch sử chat khi đăng xuất
    setError('');
};

const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!session) {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    return;
    }

    if (!question.trim()) {
    setError('Câu hỏi không được để trống!');
    // Tùy chọn: Hiển thị lỗi trong giao diện chat
    // setHistory(prevHistory => [...prevHistory, { type: 'error', text: 'Câu hỏi không được để trống!' }]);
    return;
    }

    setError(''); // Xóa lỗi cũ
    setLoading(true);

    // Thêm câu hỏi của người dùng vào lịch sử chat ngay lập tức
    const userMessage = { type: 'user', text: question };
    setHistory(prevHistory => [...prevHistory, userMessage]);
    const currentQuestion = question; // Lưu lại câu hỏi để sử dụng sau
    setQuestion(''); // Xóa nội dung input sau khi gửi

    try {
    const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        // Đảm bảo session và access_token tồn tại trước khi dùng
        Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ message: currentQuestion }), // Sử dụng câu hỏi đã lưu
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Lỗi ${res.status}: Không nhận được phản hồi từ server.`);
    }

    const data = await res.json();
    // Thêm câu trả lời của trợ lý vào lịch sử chat
    const assistantMessage = { type: 'assistant', text: data.answer, relevant_laws: data.relevant_laws };
    setHistory(prevHistory => [...prevHistory, assistantMessage]);

    } catch (err) {
    // Xử lý lỗi: Thêm tin nhắn lỗi vào lịch sử chat
    const errorMessage = { type: 'error', text: 'Lỗi: ' + err.message };
    setHistory(prevHistory => [...prevHistory, errorMessage]);
    // Vẫn giữ setError nếu bạn muốn hiển thị lỗi ở nơi khác nữa
    setError('Đã xảy ra lỗi khi xử lý yêu cầu.'); // Thông báo lỗi chung
    } finally {
    setLoading(false);
    }
};

return (
    <div className="app-container"> {/* Class CSS tùy chỉnh */}
    <Topbar
        session={session}
        onLogout={handleLogout}
        onLogin={handleLoginWithGoogle}
    />

    <main className="main-content"> {/* Class CSS tùy chỉnh */}
        <ChatSection
        // Không cần truyền session nếu ChatInput không dùng
        // session={session}
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmitQuestion}
        // Truyền lịch sử chat thay vì response
        history={history}
        // Không truyền error trực tiếp nữa, error được hiển thị trong history
        // error={error}
        loading={loading}
        />
    </main>

    {/* Hiển thị notification nếu có */}
    {showNotification && <Notification onClose={() => setShowNotification(false)} />}

    {/* Nếu bạn vẫn muốn hiển thị lỗi riêng, có thể thêm ở đây */}
    {/* {error && <p className="app-error-message">Error: {error}</p>} */}
    </div>
);
}

export default App;