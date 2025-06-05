// src/components/ChatSection.js
import React from 'react';
import ChatInput from './ChatInput';
import ChatDisplay from './ChatDisplay';

const ChatSection = ({
// Không cần session ở đây nữa trừ khi ChatInput cần
// session,
question,
setQuestion,
onSubmit,
// Nhận history thay vì response
history,
error,
loading,
}) => {
return (
    <div className="chat-section"> {/* Class tùy chỉnh */}
    <h2 className="section-title"> {/* Class tùy chỉnh */}
        Hỏi đáp luật dân sự
    </h2>

    <div className="chat-container"> {/* Class tùy chỉnh */}
        {/* Truyền history cho ChatDisplay */}
        <ChatDisplay history={history} error={error} />
        <ChatInput
        question={question}
        setQuestion={setQuestion}
        onSubmit={onSubmit}
        loading={loading}
        />
    </div>
    </div>
);
};

export default ChatSection;