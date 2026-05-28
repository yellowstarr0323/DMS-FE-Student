/* StatusChip — 신청 상태(요청중/1차/최종/거절) 배지.
   STATUS_META 는 상태별 라벨/색 단일 출처로, 다른 컴포넌트도 가져다 쓴다. */

import styled from "styled-components";

// 백엔드 Status enum 값(PENDING/FIRST_APPROVED/SECOND_APPROVED/REJECTED/EXPIRED)을 키로 쓴다.
export const STATUS_META = {
  PENDING: { label: "요청 중", bg: "var(--gray-200)", fg: "var(--gray-500)", dot: "var(--gray-400)" },
  FIRST_APPROVED: { label: "1차 승인", bg: "var(--primary-blue-50)", fg: "var(--primary-blue-300)", dot: "var(--primary-blue-300)" },
  SECOND_APPROVED: { label: "최종 승인", bg: "var(--primary-blue-300)", fg: "#fff", dot: "#fff" },
  REJECTED: { label: "거절 됨", bg: "var(--error-50)", fg: "var(--error-300)", dot: "var(--error-300)" },
  EXPIRED: { label: "만료됨", bg: "var(--gray-200)", fg: "var(--gray-400)", dot: "var(--gray-400)" },
};

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $size }) => ($size === "sm" ? "4px 8px" : "6px 12px")};
  border-radius: var(--radius-xs);
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  font-family: var(--font-sans);
  font-size: ${({ $size }) => ($size === "sm" ? "11px" : "12px")};
  font-weight: 700;
  letter-spacing: var(--tracking);
  line-height: 1;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
  background: ${({ $dot }) => $dot};
  display: inline-block;
`;

export function StatusChip({ status, withDot = false, size = "md" }) {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  return (
    <Chip $size={size} $bg={meta.bg} $fg={meta.fg}>
      {withDot && <Dot $dot={meta.dot} />}
      {meta.label}
    </Chip>
  );
}
