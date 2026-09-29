/* ChatbotPanel — 우측 하단 플로팅 버튼 + 기숙사 규정 챗 패널.
   상태(메시지 · 전송 중)는 useChatbot 이 갖고, 이 컴포넌트는 props 로 받아 그리기만 한다.
   열림/닫힘과 입력 중인 글은 UI 상태라 여기서 들고 있는다. */

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "./icon.jsx";

const Fab = styled.button`
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-300);
  box-shadow: var(--shadow-toast);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 40;
  transition: background 0.12s;

  &:hover {
    background: var(--primary-blue-400);
  }

  @media (max-width: 640px) {
    right: 16px;
    bottom: 16px;
  }
`;

const Panel = styled.section`
  position: fixed;
  right: 32px;
  bottom: 104px;
  width: 380px;
  height: min(600px, calc(100vh - 136px));
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dropdown);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 45;
  font-family: var(--font-sans);

  @media (max-width: 640px) {
    inset: 0;
    width: auto;
    height: auto;
    border: none;
    border-radius: 0;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--gray-200);
`;

const HeaderBadge = styled.span`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`;

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);
`;

const HeaderSub = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-400);

  &:hover {
    background: var(--system-bg-2);
    color: var(--gray-600);
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--system-bg-2);
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  gap: 6px;
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: var(--tracking);
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;

  ${({ $mine, $error }) =>
    $mine
      ? `background: var(--primary-blue-300); color: #fff; border-bottom-right-radius: var(--radius-xs);`
      : $error
        ? `background: var(--error-50); color: var(--error-400); border-bottom-left-radius: var(--radius-xs);`
        : `background: #fff; color: var(--gray-700); border: 1px solid var(--gray-200); border-bottom-left-radius: var(--radius-xs);`}

  strong {
    font-weight: 700;
  }
`;

const RetryButton = styled.button`
  border: none;
  background: none;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    color: var(--gray-700);
  }
`;

const Pending = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const Composer = styled.form`
  padding: 12px 16px 14px;
  border-top: 1px solid var(--gray-200);
  background: #fff;
`;

const InputBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding: 8px 8px 8px 14px;
  transition: border-color 0.12s;

  &:focus-within {
    border-color: var(--primary-blue-300);
  }
`;

const NativeTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  max-height: 120px;
  padding: 6px 0;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
  line-height: 1.5;

  &::placeholder {
    color: var(--gray-400);
  }
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  flex: none;
  border: none;
  border-radius: var(--radius-md);
  background: ${({ disabled }) => (disabled ? "var(--primary-blue-100)" : "var(--primary-blue-300)")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: background 0.12s;
`;

const Footnote = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const GREETING =
  "안녕하세요! 기숙사 규정에 대해 궁금한 걸 물어봐 주세요.\n질문마다 따로 답해서, 앞 대화는 기억하지 못해요.";

// LLM 답변에 섞여 오는 마크다운 중 자주 나오는 것(**굵게**, 목록 기호, # 제목)만 가볍게 정리한다.
// HTML 로 주입하지 않고 React 요소로만 만든다.
function renderInline(line, key) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={`${key}-${i}`}>{part}</strong> : part));
}

function renderAnswer(text) {
  return text.split("\n").map((raw, i, lines) => {
    const line = raw.replace(/^\s*#{1,6}\s+/, "").replace(/^(\s*)[*-]\s+/, "$1• ");
    return (
      <span key={i}>
        {renderInline(line, i)}
        {i < lines.length - 1 && "\n"}
      </span>
    );
  });
}

export function ChatbotPanel({ messages, pending, onSend, onRetry, maxLength }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // 새 메시지·대기 표시가 생기면 맨 아래로.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // 입력 줄 수만큼 높이를 늘린다(max-height 에서 멈추고 스크롤).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, open]);

  const canSend = draft.trim().length > 0 && !pending;

  function submit(e) {
    e?.preventDefault();
    if (!canSend) return;
    if (onSend(draft)) setDraft("");
  }

  function onKeyDown(e) {
    // 한글 조합 중 Enter 는 조합 확정용이라 전송하면 마지막 글자가 한 번 더 보내진다.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function onPanelKeyDown(e) {
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <>
      {open && (
        <Panel role="dialog" aria-label="기숙사 규정 챗봇" onKeyDown={onPanelKeyDown}>
          <Header>
            <HeaderBadge>
              <Icon name="chat" size={18} color="var(--primary-blue-300)" />
            </HeaderBadge>
            <HeaderText>
              <HeaderTitle>규정 도우미</HeaderTitle>
              <HeaderSub>기숙사 규정 문서를 근거로 답해요</HeaderSub>
            </HeaderText>
            <IconButton type="button" aria-label="닫기" onClick={() => setOpen(false)}>
              <Icon name="x" size={18} />
            </IconButton>
          </Header>

          <List ref={listRef} aria-live="polite">
            <Row>
              <Bubble>{GREETING}</Bubble>
            </Row>
            {messages.map((m) => (
              <Row key={m.id} $mine={m.role === "user"}>
                <Bubble $mine={m.role === "user"} $error={m.error}>
                  {m.role === "bot" && !m.error ? renderAnswer(m.text) : m.text}
                </Bubble>
                {m.error && m.question && (
                  <RetryButton type="button" onClick={() => onRetry(m.id)} disabled={pending}>
                    <Icon name="history" size={14} />
                    다시 시도
                  </RetryButton>
                )}
              </Row>
            ))}
            {pending && (
              <Row>
                <Pending>답변을 찾는 중…</Pending>
              </Row>
            )}
          </List>

          <Composer onSubmit={submit}>
            <InputBox>
              <NativeTextarea
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={maxLength}
                placeholder="예) 외박은 언제까지 신청해야 해요?"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="질문 입력"
              />
              <SendButton type="submit" disabled={!canSend} aria-label="보내기">
                <Icon name="send" size={18} color="#fff" />
              </SendButton>
            </InputBox>
            <Footnote>
              <span>AI 답변은 틀릴 수 있어요. 중요한 건 사감선생님께 확인하세요.</span>
              <span>
                {draft.length}/{maxLength}
              </span>
            </Footnote>
          </Composer>
        </Panel>
      )}

      <Fab
        type="button"
        aria-label={open ? "챗봇 닫기" : "챗봇 열기"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "x" : "chat"} size={24} color="#fff" />
      </Fab>
    </>
  );
}
