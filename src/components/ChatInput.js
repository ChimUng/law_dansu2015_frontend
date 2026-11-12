import React from 'react';

const ChatInput = ({ question, setQuestion, onSubmit, loading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSubmit(event); }
  };
  return (
    <form onSubmit={onSubmit} className="chat-input-form">
      <textarea rows={1} className="chat-input-textarea" placeholder="Nhập câu hỏi về Bộ luật Dân sự 2015…"
        value={question} disabled={loading} onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown} aria-label="Câu hỏi pháp luật" />
      <button type="submit" disabled={loading || !question.trim()} className="send-button" aria-label="Gửi câu hỏi">
        {loading ? <span className="spinner" /> : '↑'}
      </button>
    </form>
  );
};

export default ChatInput;
