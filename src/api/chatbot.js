/* 챗봇 API — 기숙사 규정 질문.
   - POST /chatbots/questions { question } → { answer }
   - question 은 공백 불가 · 500자 이하 (AskChatbotWebRequest)
   - 서버는 대화 기록을 받지 않는다. 질문 하나하나가 독립이다. */

import { api } from "./client.js";

export const CHATBOT_QUESTION_MAX = 500;

export async function askChatbot(question) {
  const data = await api.post("/chatbots/questions", { question });
  return data?.answer ?? "";
}
