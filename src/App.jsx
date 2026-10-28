import { useState, useEffect } from 'react';
import { startConversation, sendMessage } from './api';
import './App.css';

export default function App() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    startConversation()
      .then(res => setConversationId(res.conversation_id))
      .catch(err => setMessages([{ id: 'init', role: 'error', text: err.message }]));
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending || !conversationId) return;

    setDraft('');
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text }]);
    setSending(true);

    try {
      const res = await sendMessage(conversationId, text);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'error', text: err.message }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat">
      <header className="chat-header">
        <h1>Model test</h1>
        <span className="conv-id">{conversationId ?? 'connecting…'}</span>
      </header>

      <ul className="messages">
        {messages.map(m => (
          <li key={m.id} className={`msg msg-${m.role}`}>{m.text}</li>
        ))}
        {sending && <li className="msg msg-pending">…</li>}
      </ul>

      <form className="composer" onSubmit={handleSend}>
        <label htmlFor="draft" className="sr-only">Message</label>
        <input
          id="draft"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a message"
          autoComplete="off"
        />
        <button type="submit" disabled={sending || !draft.trim()}>Send</button>
      </form>
    </div>
  );
}