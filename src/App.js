import React, { useEffect, useMemo, useState } from 'react';
import ChatSidebar from './components/ChatSidebar';
import Topbar from './components/Topbar';
import ChatSection from './components/Chatsection';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const CHAT_STORAGE_KEY = 'luat-minh-bach-chat-rooms-v1';
const MAX_LOCAL_CHAT_ROOMS = 12;

const createChat = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: 'Cuộc trò chuyện mới',
  messages: [],
  updatedAt: new Date().toISOString(),
});

const loadChats = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CHAT_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length) return stored.slice(0, MAX_LOCAL_CHAT_ROOMS);
  } catch (_) { /* A malformed local cache should never block chat. */ }
  return [createChat()];
};

const parseSseBlock = (block) => {
  const lines = block.split('\n');
  const event = lines.find((line) => line.startsWith('event:'))?.slice(6).trim() || 'message';
  const data = lines.filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n');
  return data ? { event, data: JSON.parse(data) } : null;
};

function App() {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState(loadChats);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    try { window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_LOCAL_CHAT_ROOMS))); } catch (_) { /* Storage is optional. */ }
  }, [chats]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [chats, activeChatId],
  );
  const history = activeChat?.messages || [];

  const updateChat = (chatId, update) => {
    setChats((items) => {
      const changed = items.map((chat) => chat.id === chatId ? update(chat) : chat);
      const selected = changed.find((chat) => chat.id === chatId);
      return [selected, ...changed.filter((chat) => chat.id !== chatId)].slice(0, MAX_LOCAL_CHAT_ROOMS);
    });
  };

  const startNewChat = () => {
    if (loading) return;
    const newChat = createChat();
    setChats((items) => [newChat, ...items].slice(0, MAX_LOCAL_CHAT_ROOMS));
    setActiveChatId(newChat.id);
    setQuestion('');
  };

  const askQuestion = async (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading || !activeChat) return;
    const targetChatId = activeChat.id;
    setLoading(true);
    setProgress({ scope: { state: 'active', detail: 'Đang nhận câu hỏi' } });
    updateChat(targetChatId, (chat) => ({
      ...chat,
      title: chat.messages.some((item) => item.type === 'user') ? chat.title : trimmedMessage.slice(0, 48),
      updatedAt: new Date().toISOString(),
      messages: [...chat.messages, { type: 'user', text: trimmedMessage }],
    }));
    setQuestion('');

    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ message: trimmedMessage, debug: demoMode }),
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Máy chủ trả về lỗi ${response.status}.`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalPayload = null;
      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';
        for (const block of blocks) {
          if (!block.trim()) continue;
          const parsed = parseSseBlock(block);
          if (!parsed) continue;
          if (parsed.event === 'progress') {
            setProgress((current) => ({ ...current, [parsed.data.step]: { state: parsed.data.state, detail: parsed.data.detail } }));
          }
          if (parsed.event === 'final') finalPayload = parsed.data;
        }
        if (done) break;
      }
      if (!finalPayload) throw new Error('Máy chủ chưa gửi kết quả cuối cùng.');
      updateChat(targetChatId, (chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: [...chat.messages, {
          type: 'assistant', text: finalPayload.answer, relevant_laws: finalPayload.relevant_laws || [],
          scope: finalPayload.scope, retrievalTrace: finalPayload.retrieval_trace,
        }],
      }));
    } catch (requestError) {
      updateChat(targetChatId, (chat) => ({
        ...chat,
        messages: [...chat.messages, { type: 'error', text: requestError.message || 'Không thể kết nối máy chủ.' }],
      }));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleSubmitQuestion = (event) => { event.preventDefault(); askQuestion(question); };

  return (
    <div className="app-shell">
      <ChatSidebar chats={chats} activeChatId={activeChat?.id} onNewChat={startNewChat}
        onSelectChat={(chatId) => !loading && setActiveChatId(chatId)} />
      <main className="workspace">
        <Topbar chatTitle={activeChat?.title} />
        <div className="main-content">
          <ChatSection question={question} setQuestion={setQuestion} onSubmit={handleSubmitQuestion}
            onExample={askQuestion} history={history} loading={loading} demoMode={demoMode}
            setDemoMode={setDemoMode} progress={progress} />
        </div>
      </main>
    </div>
  );
}

export default App;
