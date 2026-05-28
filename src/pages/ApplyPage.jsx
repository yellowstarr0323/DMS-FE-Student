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
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);
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
`;

const FormHeader = styled.header`
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);
`;

const FormSubtitle = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
`;

const StepBadge = styled.span`
  padding: 6px 12px;
  background: var(--system-bg-2);
  color: var(--gray-500);
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: var(--tracking);
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

const todayLabel = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
}).format(new Date());

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
          <Today>{todayLabel} · 오늘</Today>
        </TitleRow>

        <LatestBlock>
          {myApplication.loading ? (
            <LoadingCard>최신 신청을 불러오는 중…</LoadingCard>
          ) : myApplication.data ? (
            <LatestApplicationCard application={myApplication.data} />
          ) : (
            <EmptyLatest />
          )}
        </LatestBlock>

        <FormSection>
          <FormHeader>
            <div>
              <FormTitle>새 신청 작성</FormTitle>
              <FormSubtitle>네 항목 모두 입력해주세요.</FormSubtitle>
            </div>
            <StepBadge>1 · 작성</StepBadge>
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
