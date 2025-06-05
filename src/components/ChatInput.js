// src/components/ChatInput.js
import React from 'react';

const ChatInput = ({ question, setQuestion, onSubmit, loading }) => {
const handleKeyDown = (e) => {
    // Gửi form khi nhấn Enter nhưng không nhấn Shift
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSubmit(e);
    }
};

return (
    <form
    onSubmit={onSubmit}
    className="chat-input-form" 
    >
    <textarea
        rows={1} // Bắt đầu với 1 dòng
        className="chat-input-textarea" 
        placeholder="Nhập câu hỏi và nhấn Enter..."
        value={question}
        disabled={loading} // Vô hiệu hóa khi đang loading
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
    />
    <button
        type="submit"
        disabled={loading} // Vô hiệu hóa khi đang loading
        className="send-button" 
    >
        {/* Icon SVG giữ nguyên, style sẽ dùng CSS */}
        {/* Biểu tượng máy bay giấy xoay 45 độ */}
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    </button>
    </form>
);
};

export default ChatInput;