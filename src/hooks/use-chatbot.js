/* useChatbot — 챗봇 대화 상태. 메시지 목록 · 전송 중 여부 · 실패한 질문 재시도.
   대화는 메모리에만 있다(새로고침하면 사라진다). 서버가 기록을 받지 않으므로
   화면의 이전 대화는 다음 답변에 영향을 주지 않는다. */

import { useState, useRef, useCallback } from "react";
import { askChatbot } from "../api/chatbot.js";

function toErrorText(e) {
  if (e?.status === 400) return "질문을 확인하지 못했어요. 내용을 바꿔서 다시 물어봐 주세요.";
  if (e?.status === 403) return "학생 계정만 챗봇을 쓸 수 있어요.";
  if (e?.status >= 500) return "답변을 만들지 못했어요. 잠시 뒤 다시 시도해 주세요.";
  return "연결에 실패했어요. 네트워크를 확인하고 다시 시도해 주세요.";
}

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const seq = useRef(0);
  const nextId = () => ++seq.current;

  const ask = useCallback(async (question) => {
    setPending(true);
    try {
      const answer = await askChatbot(question);
      setMessages((m) => [...m, { id: nextId(), role: "bot", text: answer }]);
    } catch (e) {
      // 실패한 질문을 들고 있어야 재시도 버튼이 같은 질문을 다시 보낼 수 있다.
      setMessages((m) => [...m, { id: nextId(), role: "bot", text: toErrorText(e), error: true, question }]);
    } finally {
      setPending(false);
    }
  }, []);

  const send = useCallback(
    (raw) => {
      const question = raw.trim();
      if (!question || pending) return false;
      setMessages((m) => [...m, { id: nextId(), role: "user", text: question }]);
      ask(question);
      return true;
    },
    [ask, pending],
  );

  // 에러 말풍선을 지우고 같은 질문을 다시 보낸다(사용자 말풍선은 이미 있으므로 다시 넣지 않는다).
  const retry = useCallback(
    (messageId) => {
      if (pending) return;
      const failed = messages.find((m) => m.id === messageId);
      if (!failed?.question) return;
      setMessages((m) => m.filter((x) => x.id !== messageId));
      ask(failed.question);
    },
    [ask, messages, pending],
  );

  return { messages, pending, send, retry };
}
