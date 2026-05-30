/* AppHeader — 로고 + 페이지 타이틀 + 프로필 + 로그아웃의 상단 바. */

import styled from "styled-components";
import { Icon } from "./icon.jsx";
import markUrl from "../assets/dms-mark.png";

const Header = styled.header`
  height: 72px;
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  padding: 0 40px;
  gap: 20px;
  font-family: var(--font-sans);

  @media (max-width: 640px) {
    padding: 0 16px;
    gap: 12px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Mark = styled.img`
  height: 32px;
`;

const BrandName = styled.span`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  color: var(--gray-700);
`;

const Divider = styled.span`
  height: 18px;
  width: 1px;
  background: var(--gray-200);
  display: inline-block;

  @media (max-width: 640px) {
    display: none;
  }
`;

const PageTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);

  @media (max-width: 640px) {
    display: none;
  }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-50);
  color: var(--primary-blue-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: var(--tracking);
  overflow: hidden;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NameBlock = styled.div`
  line-height: 1.25;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const SubId = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--gray-500);
  display: flex;
`;

export function AppHeader({ student, onLogout }) {
  return (
    <Header>
      <Brand>
        <Mark src={markUrl} alt="" />
        <BrandName>DMS</BrandName>
      </Brand>
      <Divider />
      <PageTitle>새벽자습 신청</PageTitle>

      <Right>
        <Profile>
          <Avatar>
            {student.profileImageUrl
              ? <AvatarImg src={student.profileImageUrl} alt={student.name} />
              : student.initial}
          </Avatar>
          <NameBlock>
            <Name>{student.name}</Name>
            <SubId>{student.id}</SubId>
          </NameBlock>
        </Profile>
        <LogoutButton onClick={onLogout} title="로그아웃">
          <Icon name="logout" size={18} />
        </LogoutButton>
      </Right>
    </Header>
  );
}
