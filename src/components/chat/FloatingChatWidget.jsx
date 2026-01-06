import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { sendChatMessage } from '../../services/chatApi';
import { loadChat,saveChat } from './chatStorage';
import { useChat } from '../../context/ChatContext';

const FloatingChatWidget = () => {
  const { chatState, closeChat } = useChat();
  const { isOpen, caseId, sessionId: initialSessionId } = chatState;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);

  const bottomRef = useRef(null);

  // Load stored chat
  useEffect(() => {
    if (caseId) {
      const stored = loadChat(caseId);
      if (stored) {
        setMessages(stored.messages);
        setSessionId(stored.sessionId);
      } else {
        setMessages([
          {
            role: 'assistant',
            text: 'Hello! Ask me anything about this case.',
          },
        ]);
      }
    }
  }, [caseId]);

  // Persist
  useEffect(() => {
    if (caseId) {
      saveChat(caseId, { messages, sessionId });
    }
  }, [messages, sessionId, caseId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const data = await sendChatMessage(caseId, userMsg.text, sessionId);
      setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Something went wrong.' },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 360,
        height: 480,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 8,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1500,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
        }}
      >
        Case Chat
        <IconButton size="small" onClick={closeChat}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 1.5, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              mb: 1.5,
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: m.role === 'user' ? '#2563eb' : '#f1f5f9',
              color: m.role === 'user' ? 'white' : 'black',
              px: 1.5,
              py: 1,
              borderRadius: 2,
              maxWidth: '85%',
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {m.text}
            </ReactMarkdown>
          </Box>
        ))}
        {typing && <CircularProgress size={18} />}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 1.5, borderTop: '1px solid #e5e7eb' }}>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question…"
          style={{
            width: '100%',
            resize: 'none',
            padding: 8,
            borderRadius: 6,
            border: '1px solid #cbd5f5',
            fontSize: 14,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default FloatingChatWidget;
