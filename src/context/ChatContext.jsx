import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isOpen: false,
    caseId: null,
    sessionId: null,
  });

  const openChat = ({ caseId, sessionId }) => {
    setChatState({
      isOpen: true,
      caseId,
      sessionId: sessionId || null,
    });
  };

  const closeChat = () => {
    setChatState({
      isOpen: false,
      caseId: null,
      sessionId: null,
    });
  };

  return (
    <ChatContext.Provider value={{ chatState, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
