// export const loadChat = (caseId) => {
//   try {
//     const raw = localStorage.getItem(`case-chat-${caseId}`);
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// };

// export const saveChat = (caseId, data) => {
//   localStorage.setItem(`case-chat-${caseId}`, JSON.stringify(data));
// };
export const loadChat = (caseId) => {
  try {
    const raw = localStorage.getItem(`case-chat-${caseId}`);
    return raw ? JSON.parse(raw) : { messages: [], sessionId: null };
  } catch {
    return { messages: [], sessionId: null };
  }
};

export const saveChat = (caseId, data) => {
  localStorage.setItem(`case-chat-${caseId}`, JSON.stringify(data));
};

export const appendMessage = (caseId, message, sessionId) => {
  const existing = loadChat(caseId);

  const updated = {
    sessionId: sessionId ?? existing.sessionId,
    messages: [...(existing.messages || []), message],
  };

  saveChat(caseId, updated);
};

export const clearAllChats = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("case-chat-")) {
      localStorage.removeItem(key);
    }
  });
};
