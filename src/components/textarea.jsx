/* Textarea — 글자 수 카운터(선택)를 가진 멀티라인 입력. */

import styled from "styled-components";

const Box = styled.div`
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  font-family: var(--font-sans);
  position: relative;
  transition: border-color 0.12s;

  &:focus-within {
    border-color: var(--primary-blue-300);
  }
`;

const NativeTextarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 500;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
  line-height: 1.55;
`;

const Counter = styled.div`
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

export function Textarea({ value, onChange, placeholder, rows = 5, max }) {
  return (
    <Box>
      <NativeTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={max}
      />
      {typeof max === "number" && (
        <Counter>
          {(value || "").length} / {max}
        </Counter>
      )}
    </Box>
  );
}
