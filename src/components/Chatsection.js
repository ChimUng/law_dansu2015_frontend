import React from 'react';
import ChatInput from './ChatInput';
import ChatDisplay from './ChatDisplay';

const examples = [
  'Điều 117 quy định điều kiện có hiệu lực của giao dịch dân sự là gì?',
  'Di chúc hợp pháp cần những điều kiện nào?',
  'Tai nạn giao thông gây thiệt hại thì trách nhiệm bồi thường thế nào?',
];

const ChatSection = ({ question, setQuestion, onSubmit, onExample, history, loading }) => (
  <section className="chat-section">
    <div className={`welcome-panel ${history.length ? 'welcome-panel--compact' : ''}`}>
      <span className="eyebrow">TRA CỨU CÓ CĂN CỨ</span>
      <h1>Hỏi luật rõ ràng,<br />xem đúng điều khoản.</h1>
      <p>Trợ lý tập trung vào Bộ luật Dân sự 2015. Mỗi câu trả lời đều kèm nguồn điều luật để bạn tự kiểm tra.</p>
      {!history.length && <div className="example-grid" aria-label="Câu hỏi gợi ý">
        {examples.map((example) => <button key={example} type="button" onClick={() => onExample(example)} disabled={loading}>
          <span>↗</span>{example}
        </button>)}
      </div>}
    </div>
    <div className="scope-note"><span aria-hidden="true">ⓘ</span>Chỉ trả lời trong phạm vi Bộ luật Dân sự 2015; nội dung không đủ căn cứ sẽ được nói rõ.</div>
    <div className="chat-container">
      <ChatDisplay history={history} />
      <ChatInput question={question} setQuestion={setQuestion} onSubmit={onSubmit} loading={loading} />
      <p className="input-hint">Enter để gửi · Shift + Enter để xuống dòng</p>
    </div>
  </section>
);

export default ChatSection;
