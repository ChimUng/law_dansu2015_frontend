// src/components/ChatDisplay.js
import React from 'react';

// Nhận history thay vì response
const ChatDisplay = ({ history, error }) => {
if (error)
    return (
    <p className="error-message"> {/* Class tùy chỉnh */}
        ⚠️ {error}
    </p>
    );

// Hiển thị null nếu không có tin nhắn nào
if (!history || history.length === 0) return null;

return (
    <div className="chat-history-container"> {/* Class tùy chỉnh */}
    {/* Lặp qua mảng history để hiển thị từng tin nhắn */}
    {history.map((message, index) => (
        // Áp dụng class 'user-bubble' hoặc 'assistant-bubble' dựa vào type
        <div key={index} className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
        <p className="message-text"> {/* Class tùy chỉnh */}
            {/* Hiển thị prefix 'Bạn:' hoặc 'Trợ lý:' */}
            <strong>{message.type === 'user' ? 'Bạn:' : 'Trợ lý:'}</strong> {message.text}
        </p>
        {/* Chỉ hiển thị luật liên quan nếu có và là tin nhắn từ trợ lý */}
        {message.type === 'assistant' && message.relevant_laws && message.relevant_laws.length > 0 && (
            <div className="relevant-laws"> {/* Class tùy chỉnh */}
            <h4 className="laws-heading">📚 Điều luật liên quan:</h4> {/* Class tùy chỉnh */}
            <ul className="laws-list"> {/* Class tùy chỉnh */}
                {message.relevant_laws.map((law, idx) => (
                <li key={idx} className="law-item"> {/* Class tùy chỉnh */}
                    <strong>{law.article}</strong>: {law.content} (Độ tương đồng: {law.similarity_score})
                </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    ))}
    </div>
);
};

export default ChatDisplay;