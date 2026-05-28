/* Field — 라벨 + 입력 슬롯 + 힌트/에러 메시지 래퍼. */

import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--font-sans);
`;

const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const Required = styled.span`
  color: var(--primary-blue-300);
  margin-left: 4px;
`;

const RightNote = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const ErrorText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--error-300);
  letter-spacing: var(--tracking);
`;

export function Field({ label, hint, error, children, required, right }) {
  return (
    <Wrap>
      {label && (
        <LabelRow>
          <span>
            {label}
            {required && <Required>*</Required>}
          </span>
          {right && <RightNote>{right}</RightNote>}
        </LabelRow>
      )}
      {children}
      {hint && !error && <Hint>{hint}</Hint>}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrap>
  );
}
