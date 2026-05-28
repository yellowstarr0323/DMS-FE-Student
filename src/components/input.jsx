/* Input — leading/trailing 슬롯을 가진 텍스트 입력 박스. */

import styled from "styled-components";

const Box = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 18px;
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  transition: border-color 0.12s;

  &:focus-within {
    border-color: var(--primary-blue-300);
  }
`;

const Leading = styled.span`
  color: var(--system-button);
  display: flex;
`;

const NativeInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

export function Input({ value, placeholder, type = "text", onChange, leading, trailing, className }) {
  return (
    <Box className={className}>
      {leading && <Leading>{leading}</Leading>}
      <NativeInput type={type} value={value} onChange={onChange} placeholder={placeholder} />
      {trailing}
    </Box>
  );
}
