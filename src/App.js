import React, { useState } from 'react';
import Topbar from './components/Topbar';
import ChatSection from './components/Chatsection';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;
    setLoading(true);
    setHistory((items) => [...items, { type: 'user', text: trimmedMessage }]);
    setQuestion('');
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Máy chủ trả về lỗi ${response.status}.`);
      setHistory((items) => [...items, {
        type: 'assistant', text: data.answer, relevant_laws: data.relevant_laws || [], scope: data.scope,
      }]);
    } catch (requestError) {
      const messageText = requestError.message || 'Không thể kết nối máy chủ.';
      setHistory((items) => [...items, { type: 'error', text: messageText }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = (event) => { event.preventDefault(); askQuestion(question); };

  return (
    <div className="app-container">
      <Topbar />
      <main className="main-content">
        <ChatSection question={question} setQuestion={setQuestion} onSubmit={handleSubmitQuestion}
          onExample={askQuestion} history={history} loading={loading} />
      </main>
    </div>
  );
}

export default App;
