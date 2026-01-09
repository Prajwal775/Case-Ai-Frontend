import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogContentBottomRight } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { openChatSession, sendChatMessage } from '../services/chatApi';
import { loadChat, saveChat } from './chat/chatStorage';

export function AIChatbotModal({ isOpen, onClose, caseId, caseName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesRef = useRef(null);

  /* ================= LOAD CHAT ================= */
  useEffect(() => {
    if (!isOpen || !caseId) return;

    const load = async () => {
      try {
        const res = await openChatSession(caseId);

        const formatted = res.messages.map((m, i) => ({
          id: `${m.role}-${i}-${m.created_at}`,
          type: m.role === 'assistant' ? 'bot' : 'user',
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setSessionId(res.session_id);
        setMessages(formatted);
        saveChat(caseId, { sessionId: res.session_id, messages: formatted });
      } catch {
        const stored = loadChat(caseId);
        if (stored?.messages) {
          setMessages(stored.messages);
          setSessionId(stored.sessionId);
        }
      }
    };

    load();
  }, [isOpen, caseId]);

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputMessage,
      timestamp: getTime(),
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      saveChat(caseId, { sessionId, messages: updated });
      return updated;
    });

    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await sendChatMessage(caseId, userMessage.content, sessionId);

      const botMessage = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: res.answer,
        timestamp: getTime(),
      };

      setMessages((prev) => {
        const updated = [...prev, botMessage];
        saveChat(caseId, { sessionId: res.session_id, messages: updated });
        return updated;
      });

      setSessionId(res.session_id);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      {/* <DialogContent className='max-w-3xl h-[80vh] p-0 overflow-hidden'> */}
      <DialogContentBottomRight>
        <VisuallyHidden>
          <DialogTitle>AI Case Assistant</DialogTitle>
        </VisuallyHidden>
        {/* ================= HEADER ================= */}
        {/* <div className='flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/20 p-3 rounded-xl'>
              <Bot className='w-6 h-6 text-white' />
            </div>
            <div>
              <p className='text-lg font-semibold'>AI Case Assistant</p>
              <p className='text-sm text-white/80'>
                 {caseName} • Powered by AI
              </p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <Badge className='bg-white/20 text-white border-white/30'>
              <Sparkles className='w-3 h-3 mr-1' />
              AI Powered
            </Badge>
            <button
              onClick={onClose}
              className='rounded-md p-1 hover:bg-white/20'
              aria-label='Close chat'
            >
              <X />
            </button>
          </div>
        </div> */}
        <div className='flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white'>
          <div className='flex items-center gap-3'>
            <div className='bg-white/20 p-2 rounded-lg'>
              <Bot className='w-4 h-4 text-white' />
            </div>
            <div className='leading-tight'>
              <p className='text-sm font-semibold'>AI Case Assistant</p>
              <p className='text-xs text-white/80 truncate max-w-[220px]'>
                {caseName} • Powered by AI
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Badge className='bg-white/20 text-white border-white/30 text-[10px] px-2 py-0.5'>
              <Sparkles className='w-3 h-3 mr-1' />
              AI
            </Badge>
            <button
              onClick={onClose}
              className='rounded-md p-1 hover:bg-white/20'
              aria-label='Close chat'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        <div
          ref={messagesRef}
          className='flex-1 overflow-y-auto bg-white px-6 py-4 space-y-4'
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.type === 'bot' && (
                <div className='bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg h-fit shadow-md'>
                  <Bot className='w-5 h-5 text-white' />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                  m.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gradient-to-br from-slate-50 to-blue-50/50 text-slate-900 border border-slate-200'
                }`}
              >
                <p className='whitespace-pre-wrap leading-relaxed'>
                  {m.content}
                </p>
                <p className='text-xs mt-1 opacity-70'>{m.timestamp}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className='flex gap-3'>
              <div className='bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg'>
                <Bot className='w-5 h-5 text-white' />
              </div>
              <div className='bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl px-4 py-2 border'>
                <div className='flex gap-1.5'>
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' />
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]' />
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]' />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= INPUT ================= */}
        <div className='border-t bg-slate-50 px-6 py-4'>
          <div className='flex gap-3'>
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              placeholder='Ask me anything about this case…'
              className='resize-none'
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
          <p className='text-xs text-slate-500 mt-2'>
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
        {/* </DialogContent> */}
      </DialogContentBottomRight>
    </Dialog>
  );
}

/* ================= UTIL ================= */
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
