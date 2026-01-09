import api from '../utils/axios';

export const openChatSession = async (caseId, userId) => {
  const { data } = await api.post(
    '/api/v1/chat/open',
    { user_id: userId },
    { headers: { caseid: caseId } }
  );
  return data; // { session_id }
};

export const sendChatMessage = async (caseId, message, sessionId) => {
  const { data } = await api.post(
    '/api/v1/chat/message',
    { message, session_id: sessionId },
    { headers: { caseid: caseId } }
  );
  return data; // { answer, session_id }
};
