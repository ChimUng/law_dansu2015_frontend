import React, { useEffect, useRef } from 'react';

const ChatDisplay = ({ history }) => {
  const endOfChatRef = useRef(null);
  useEffect(() => endOfChatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), [history]);
  if (!history?.length) return null;
  return (
    <div className="chat-history-container" aria-live="polite">
      {history.map((message, index) => (
        <article key={`${message.type}-${index}`} className={`message-row message-row--${message.type}`}>
          <div className="message-avatar" aria-hidden="true">{message.type === 'user' ? 'B' : '§'}</div>
          <div className="message-content">
            <p className="message-label">{message.type === 'user' ? 'Bạn' : message.type === 'error' ? 'Kết nối' : 'Trợ lý pháp luật'}</p>
            <p className="message-text">{message.text}</p>
            {message.type === 'assistant' && message.relevant_laws?.length > 0 && (
              <details className="relevant-laws" open>
                <summary>Nguồn pháp luật ({message.relevant_laws.length})</summary>
                <ul className="laws-list">
                  {message.relevant_laws.map((law, lawIndex) => (
                    <li key={`${law.document_id || 'source'}-${law.article}-${lawIndex}`} className="law-item">
                      {law.source_name && <span className="law-source">{law.source_name}</span>}
                      <strong>{law.article}</strong><p>{law.content}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </article>
      ))}
      <div ref={endOfChatRef} />
    </div>
  );
};

export default ChatDisplay;
