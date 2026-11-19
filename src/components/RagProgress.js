import React from 'react';

const RAG_STEPS = [
  ['scope', 'Phân loại phạm vi', 'Kiểm tra câu hỏi có thuộc BLDS 2015'],
  ['retrieval', 'Hybrid retrieval', 'Keyword và semantic search trên FAISS'],
  ['ranking', 'Xếp hạng nguồn', 'Gộp tín hiệu và chọn Điều luật'],
  ['generation', 'Diễn giải có căn cứ', 'Gemini chỉ nhận các nguồn đã chọn'],
];

const RagProgress = ({ progress }) => {
  if (!progress) return null;
  const completed = RAG_STEPS.filter(([id]) => progress[id]?.state === 'completed').length;
  return (
    <section className="rag-progress" aria-live="polite" aria-label="Tiến trình xử lý RAG">
      <div className="rag-progress-heading"><span className="progress-pulse" />Đang xử lý câu hỏi <strong>{completed}/{RAG_STEPS.length}</strong></div>
      <ol>
        {RAG_STEPS.map(([id, title, description]) => {
          const item = progress[id] || { state: 'pending' };
          return <li key={id} className={`progress-step progress-step--${item.state}`}>
            <span className="progress-icon">{item.state === 'completed' ? '✓' : item.state === 'active' ? '◌' : '·'}</span>
            <span><b>{title}</b><small>{item.detail || description}</small></span>
          </li>;
        })}
      </ol>
    </section>
  );
};

export default RagProgress;
