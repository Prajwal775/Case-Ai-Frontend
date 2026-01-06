export const loadChat = (caseId) => {
  try {
    const raw = localStorage.getItem(`case-chat-${caseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveChat = (caseId, data) => {
  localStorage.setItem(`case-chat-${caseId}`, JSON.stringify(data));
};
