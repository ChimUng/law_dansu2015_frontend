import React from 'react';

const ChatSidebar = ({ chats, activeChatId, onNewChat, onSelectChat }) => (
  <aside className="chat-sidebar" aria-label="Lịch sử cuộc trò chuyện">
    <div className="sidebar-brand">
      <span className="brand-mark" aria-hidden="true">§</span>
      <div><strong>Luật Minh Bạch</strong><span>BLDS 2015 · RAG</span></div>
    </div>
    <button type="button" className="new-chat-button" onClick={onNewChat}>＋ Cuộc trò chuyện mới</button>
    <p className="sidebar-heading">GẦN ĐÂY</p>
    <nav className="chat-room-list">
      {chats.map((chat) => (
        <button key={chat.id} type="button" onClick={() => onSelectChat(chat.id)}
          className={`chat-room-button ${chat.id === activeChatId ? 'chat-room-button--active' : ''}`}>
          <span>{chat.title || 'Cuộc trò chuyện mới'}</span>
          <small>{chat.messages?.length ? `${Math.ceil(chat.messages.length / 2)} lượt hỏi` : 'Chưa có câu hỏi'}</small>
        </button>
      ))}
    </nav>
    <p className="sidebar-footnote">Lịch sử đang lưu cục bộ trên trình duyệt này.</p>
  </aside>
);

export default ChatSidebar;
