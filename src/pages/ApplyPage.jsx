/* ApplyPage — 최신 신청 1건 요약 + 새 신청 작성 폼.
  프로필/교사/유형/최신신청을 백엔드에서 로드하고, 폼 제출로 신청을 보낸다.
   로그아웃 시 토큰을 비우고 /login 으로 이동. */

import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  AppHeader,
  ApplyForm,
  LatestApplicationCard,
  EmptyLatest,
  Icon,
} from "../components/index.js";
import { useToast, useAsyncData } from "../hooks/index.js";
import { getMyProfile } from "../api/student.js";
import { getGeneralTeachers } from "../api/teacher.js";
import { getStudyTypes, getMyApplication, applyStudyApplication } from "../api/daybreak.js";
import { signOut } from "../api/auth.js";

const Page = styled.div`
  min-height: 100vh;
  background: var(--system-bg-2);
  font-family: var(--font-sans);
`;

const Main = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 40px 64px;

  @media (max-width: 900px) {
    padding: 32px 24px 56px;
  }

  @media (max-width: 640px) {
    padding: 24px 16px 48px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 16px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const Today = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
`;

const LatestBlock = styled.div`
  margin-bottom: 32px;
`;

const LoadingCard = styled.div`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 32px;
  border: 1px solid var(--gray-200);
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const FormSection = styled.section`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 36px 40px;
  border: 1px solid var(--gray-200);

  @media (max-width: 640px) {
    padding: 24px 16px;
    border-radius: var(--radius-lg);
  }
`;

const FormHeader = styled.header`
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  padding: 14px 22px;
  background: #fff;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-toast);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
  z-index: 50;
`;

const ToastIcon = styled.span`
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  background: ${({ $tone }) => ($tone === "error" ? "var(--error-300)" : "var(--primary-blue-300)")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Notice = styled.div`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  border: 1px dashed var(--gray-300);
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
  line-height: 1.6;

  @media (max-width: 640px) {
    padding: 20px 16px;
    border-radius: var(--radius-lg);
  }
`;

// 백엔드는 EXPIRED/REJECTED 가 아닌 신청을 "진행 중"으로 보고 새 신청에 409 를 준다
// (CheckDaybreakServiceImpl.checkDaybreakStudyApplicationExists).
// 폼을 열어두고 막는 화면이 되지 않도록 제외 목록을 백엔드와 똑같이 맞춘다 —
// 새 상태 값이 생기면 양쪽 다 "진행 중"으로 취급된다.
const CLOSED_STATUSES = ["EXPIRED", "REJECTED"];

const FALLBACK_STUDENT = { name: "학생", id: "", initial: "·" };

function toHeaderStudent(profile) {
  if (!profile) return FALLBACK_STUDENT;
  return {
    name: profile.name,
    id: profile.gcn,
    initial: profile.name?.[0] ?? "·",
    profileImageUrl: profile.profileImageUrl ?? null,
  };
}

function ApplyPage() {
  const navigate = useNavigate();
  const toast = useToast(1800);

  const profile = useAsyncData(getMyProfile);
  const teachers = useAsyncData(getGeneralTeachers);
  const types = useAsyncData(getStudyTypes);
  const myApplication = useAsyncData(getMyApplication);

  const [teacherId, setTeacherId] = React.useState(null);
  const [typeId, setTypeId] = React.useState(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await applyStudyApplication({ teacherId, typeId, reason, startDate, endDate });
      toast.show("새벽자습 신청을 보냈어요.", "success");
      myApplication.reload();
      setTeacherId(null);
      setTypeId(null);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (e) {
      if (e?.status === 409) {
        toast.show("이미 진행 중인 신청이 있어요.", "error");
      } else {
        toast.show(e?.message || "신청에 실패했어요.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // 만료된 신청은 카드로 띄우지 않는다 — "만료됨" 칩을 못 보고 신청이 살아 있다고 오해하는 사례가 있었다.
  const status = myApplication.data?.status ?? null;
  const isExpired = status === "EXPIRED";
  const latestApplication = isExpired ? null : myApplication.data;

  // 요청 중 / 1차 승인 / 최종 승인 상태에서는 새로 신청할 일이 없고 백엔드도 409 로 막으므로 폼을 감춘다.
  const hasActiveApplication = status !== null && !CLOSED_STATUSES.includes(status);

  function logout() {
    signOut();
    navigate("/login");
  }

  return (
    <Page>
      <AppHeader student={toHeaderStudent(profile.data)} onLogout={logout} />
      <Main>
        <TitleRow>
          <Title>새벽자습 신청</Title>
        </TitleRow>

        <LatestBlock>
          {myApplication.loading ? (
            <LoadingCard>최신 신청을 불러오는 중…</LoadingCard>
          ) : latestApplication ? (
            <LatestApplicationCard application={latestApplication} />
          ) : (
            <EmptyLatest expired={isExpired} />
          )}
        </LatestBlock>

        {myApplication.loading ? null : hasActiveApplication ? (
          <Notice>
            진행 중인 신청이 있어 새 신청은 작성할 수 없어요. 승인 결과가 나오거나 신청 기간이 지나면 다시 신청할 수 있어요.
          </Notice>
        ) : (
          <FormSection>
            <FormHeader>
              <div>
                <FormTitle>새 신청 작성</FormTitle>
              </div>
            </FormHeader>
            <ApplyForm
              teachers={teachers.data ?? []}
              types={types.data ?? []}
              teacherId={teacherId}
              setTeacherId={setTeacherId}
              typeId={typeId}
              setTypeId={setTypeId}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              reason={reason}
              setReason={setReason}
              onSubmit={submit}
              submitting={submitting}
            />
          </FormSection>
        )}
      </Main>

      {toast.visible && (
        <Toast>
          <ToastIcon $tone={toast.tone}>
            <Icon name={toast.tone === "error" ? "x" : "check"} size={14} color="#fff" strokeWidth={2.6} />
          </ToastIcon>
          {toast.message}
        </Toast>
      )}
    </Page>
  );
}


export default ApplyPage;
