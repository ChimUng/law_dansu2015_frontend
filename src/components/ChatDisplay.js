import React, { useEffect, useRef } from 'react';
import RagProgress from './RagProgress';

const stages = [
  ['exact_article', '1. Exact lookup', 'Tìm trực tiếp theo “Điều X”'],
  ['keyword_phrase', '2. Keyword / phrase', 'Khớp từ khóa và cụm pháp lý'],
  ['semantic_faiss', '3. Semantic / FAISS', 'Tìm các đoạn gần nghĩa trong vector index'],
  ['hybrid_rerank', '4. Hybrid ranking', 'Gộp keyword, semantic và luật ưu tiên theo ngữ cảnh'],
  ['final', '5. Context gửi Gemini', 'Các nguồn cuối cùng được phép dùng để trả lời'],
];

const RetrievalTrace = ({ trace }) => {
  if (!trace) return null;
  return (
    <details className="retrieval-trace">
      <summary>Chế độ demo: xem luồng RAG</summary>
      <p className="trace-scope">Phạm vi được nhận diện: <strong>{trace.scope || 'civil'}</strong></p>
      <div className="trace-stages">
        {stages.map(([key, title, description]) => {
          const candidates = trace[key] || [];
          return (
            <section className="trace-stage" key={key}>
              <div><strong>{title}</strong><span>{description}</span></div>
              {candidates.length ? <ol>
                {candidates.map((candidate, candidateIndex) => (
                  <li key={`${key}-${candidate.article}-${candidateIndex}`}>
                    <b>{candidate.article}</b>
                    {candidate.keyword_score !== null && candidate.keyword_score !== undefined && <em>score {candidate.keyword_score}</em>}
                    {candidate.distance !== null && candidate.distance !== undefined && <em>distance {candidate.distance}</em>}
                    {candidate.hybrid_score !== null && candidate.hybrid_score !== undefined && <em>rank {candidate.hybrid_score}</em>}
                    {candidate.matched_intents?.length > 0 && <em>rule {candidate.matched_intents.join(', ')}</em>}
                  </li>
                ))}
              </ol> : <p className="trace-empty">Không có kết quả ở bước này.</p>}
            </section>
          );
        })}
      </div>
    </details>
  );
};

const ChatDisplay = ({ history, progress }) => {
  const endOfChatRef = useRef(null);
  useEffect(() => {
    // Effects must not return the value from a browser method. React treats any
    // returned value as a cleanup function during StrictMode remounts.
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history]);
  if (!history?.length && !progress) return null;
  return (
    <div className="chat-history-container" aria-live="polite">
      {history.map((message, index) => (
        <article key={`${message.type}-${index}`} className={`message-row message-row--${message.type}`}>
          <div className="message-avatar" aria-hidden="true">{message.type === 'user' ? 'B' : '§'}</div>
          <div className="message-content">
            <p className="message-label">{message.type === 'user' ? 'Bạn' : message.type === 'error' ? 'Kết nối' : 'Trợ lý pháp luật'}</p>
            <p className="message-text">{message.text}</p>
            {message.type === 'assistant' && <RetrievalTrace trace={message.retrievalTrace} />}
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
      <RagProgress progress={progress} />
      <div ref={endOfChatRef} />
    </div>
  );
};

export default ChatDisplay;
