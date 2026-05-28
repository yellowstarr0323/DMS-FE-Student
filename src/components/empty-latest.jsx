/* EmptyLatest — 신청 이력이 없을 때 보여주는 빈 상태 카드. */

import styled from "styled-components";
import { Icon } from "./icon.jsx";

const Section = styled.section`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  border: 1px dashed var(--gray-300);
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconCircle = styled.span`
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const Desc = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
`;

export function EmptyLatest() {
  return (
    <Section>
      <IconCircle>
        <Icon name="folder" size={22} color="var(--primary-blue-300)" />
      </IconCircle>
      <div>
        <Title>아직 신청한 새벽자습이 없어요</Title>
        <Desc>아래 폼에서 새로운 신청을 작성해보세요.</Desc>
      </div>
    </Section>
  );
}
