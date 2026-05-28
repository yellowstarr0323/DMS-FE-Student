/* LatestApplicationCard — 내 최신 새벽자습 신청 1건의 상태 + 기간 + 승인 타임라인.
   백엔드 /daybreaks/study-application/my 는 { status, startDate, endDate } 만 주므로
   유형/교사/사유/시각은 표시하지 않는다. 타임라인은 status 로만 단계를 그린다. */

import React from "react";
import styled from "styled-components";
import { Icon } from "./icon.jsx";
import { StatusChip } from "./status-chip.jsx";

const Section = styled.section`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  border: 1px solid var(--gray-200);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Kicker = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gray-500);
`;

const PeriodText = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const PeriodDays = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const Timeline = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 140px;
`;

const Node = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: ${({ $border }) => $border || "none"};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const IdleDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: var(--radius-pill);
  background: var(--gray-300);
  display: block;
`;

const StepLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: var(--tracking);
  color: ${({ $tone }) =>
    $tone === "rejected" ? "var(--error-300)" : $tone === "active" ? "var(--gray-700)" : "var(--gray-400)"};
`;

const StepTime = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const Connector = styled.div`
  flex: 1;
  height: 2px;
  margin-top: 15px;
  background: ${({ $active }) => ($active ? "var(--primary-blue-300)" : "var(--gray-200)")};
`;

function nodeView(step) {
  if (step.rejected) {
    return { bg: "var(--error-300)", fg: "#fff", content: <Icon name="x" size={14} strokeWidth={2.6} /> };
  }
  if (step.done) {
    return { bg: "var(--primary-blue-300)", fg: "#fff", content: <Icon name="check" size={14} strokeWidth={2.6} /> };
  }
  if (step.pending) {
    return {
      bg: "#fff",
      fg: "var(--primary-blue-300)",
      border: "2px dashed var(--primary-blue-300)",
      content: <Icon name="dot" size={10} color="var(--primary-blue-300)" />,
    };
  }
  return { bg: "#fff", fg: "var(--gray-400)", border: "1.5px solid var(--gray-300)", content: <IdleDot /> };
}

function stepTimeText(step) {
  if (step.rejected) return "거절됨";
  if (step.done) return "완료";
  if (step.pending) return "대기";
  return "—";
}

// yyyy-MM-dd → yyyy.MM.dd
function formatDate(date) {
  return typeof date === "string" ? date.replaceAll("-", ".") : date;
}

export function LatestApplicationCard({ application }) {
  const { status, startDate, endDate } = application;
  const isRejected = status === "REJECTED";

  const steps = [
    { key: "applied", label: "신청", done: true },
    {
      key: "first",
      label: "1차 승인",
      done: status === "FIRST_APPROVED" || status === "SECOND_APPROVED",
      pending: status === "PENDING",
      rejected: isRejected,
    },
    {
      key: "final",
      label: "최종 승인",
      done: status === "SECOND_APPROVED",
      pending: status === "FIRST_APPROVED",
    },
  ];

  return (
    <Section>
      <Head>
        <Kicker>내 최신 새벽자습 신청</Kicker>
        <StatusChip status={status} size="md" />
        <PeriodRow>
          <Icon name="cal" size={16} />
          <PeriodText>
            {formatDate(startDate)} → {formatDate(endDate)}
          </PeriodText>
        </PeriodRow>
      </Head>

      <Timeline>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const next = steps[i + 1];
          const lineActive = s.done && (next?.done || next?.pending) && !s.rejected;
          const view = nodeView(s);
          const tone = s.rejected ? "rejected" : s.done || s.pending ? "active" : "idle";
          return (
            <React.Fragment key={s.key}>
              <Step>
                <Node $bg={view.bg} $fg={view.fg} $border={view.border}>
                  {view.content}
                </Node>
                <div style={{ textAlign: "center" }}>
                  <StepLabel $tone={tone}>{s.rejected ? "거절 됨" : s.label}</StepLabel>
                  <StepTime>{stepTimeText(s)}</StepTime>
                </div>
              </Step>
              {!last && <Connector $active={lineActive} />}
            </React.Fragment>
          );
        })}
      </Timeline>
    </Section>
  );
}
