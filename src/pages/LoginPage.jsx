/* LoginPage — 학생 로그인. 좌측 브랜드 패널 + 우측 로그인 카드.
   로그인 성공 시 토스트를 띄우고 잠시 뒤 /apply 로 이동한다. */

import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Field, Input, Button, Icon } from "../components/index.js";
import { useToast } from "../hooks/index.js";
import { signIn } from "../api/auth.js";
import patternSvg from "../assets/dms-pattern.svg?raw";

const Page = styled.div`
  min-height: 100vh;
  background: var(--system-bg-2);
  font-family: var(--font-sans);
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
`;

const BrandPanel = styled.div`
  flex: 0 0 560px;
  background: var(--primary-blue-500);
  color: #fff;
  padding: 56px 56px 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    flex: 0 0 320px;
    padding: 40px 28px 36px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const Pattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.18;
  pointer-events: none;
  overflow: hidden;

  svg {
    position: absolute;
    right: -80px;
    top: -40px;
    width: 560px;
    height: auto;
  }
`;

const BrandBottom = styled.div`
  position: relative;
  margin-top: auto;
`;

const BrandEyebrow = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-blue-100);
  letter-spacing: var(--tracking);
  margin-bottom: 14px;
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.25;
`;

const BrandText = styled.p`
  margin: 20px 0 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--primary-blue-100);
  letter-spacing: var(--tracking);
  max-width: 380px;
`;

const LoginPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 640px) {
    padding: 32px 0;
    align-items: center;
  }
`;

const Card = styled.div`
  width: 440px;
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 44px 40px 36px;
  box-shadow: var(--shadow-card);

  @media (max-width: 640px) {
    width: calc(100vw - 32px);
    max-width: 440px;
    padding: 32px 20px 24px;
    border-radius: var(--radius-lg);
    box-shadow: none;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 32px;
`;

const CardKicker = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-blue-300);
  letter-spacing: var(--tracking);
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: var(--gray-700);
  letter-spacing: var(--tracking-tight);
  line-height: 1.3;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TrailingButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--system-button);
  display: flex;
`;

const RememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 18px 0 24px;
`;

const RememberLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-500);
  letter-spacing: var(--tracking);
`;

const Checkbox = styled.span`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-xs);
  background: ${({ $checked }) => ($checked ? "var(--primary-blue-300)" : "#fff")};
  border: ${({ $checked }) => ($checked ? "none" : "1px solid var(--gray-300)")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
`;

const FullButton = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  margin-bottom: 16px;
  padding: 12px 14px;
  background: var(--error-50);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--error-300);
  letter-spacing: var(--tracking);
`;

const Toast = styled.div`
  position: absolute;
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
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const ToastCheck = styled.span`
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-300);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast(1400);
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  // 백엔드 검증 규칙: accountId 4~20자, password 8~20자.
  const can = id.length >= 4 && pw.length >= 8;

  async function login() {
    if (!can || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await signIn({ accountId: id, password: pw });
      toast.show();
      setTimeout(() => navigate("/apply"), 700);
    } catch (e) {
      setError("아이디 또는 비밀번호를 다시 확인해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <BrandPanel>
        <Pattern dangerouslySetInnerHTML={{ __html: patternSvg }} />
        <BrandBottom>
          <BrandEyebrow>DSM Dormitory Management System</BrandEyebrow>
          <BrandTitle>
            새벽이 시작되기 전,
            <br />
            오늘의 자습을 신청해요.
          </BrandTitle>
          <BrandText>
            담당 선생님께 신청을 보내고, 1차 승인부터 최종 승인까지 한 곳에서 확인할 수 있어요.
          </BrandText>
        </BrandBottom>
      </BrandPanel>

      <LoginPanel>
        <Card>
          <CardHeader>
            <CardKicker>학생 로그인</CardKicker>
            <CardTitle>
              어서 와요,
              <br />
              다시 만나서 반가워요.
            </CardTitle>
          </CardHeader>

          <form onSubmit={(e) => { e.preventDefault(); login(); }}>
            <Fields>
              <Field label="아이디">
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="아이디를 입력해주세요"
                  leading={<Icon name="user" size={20} />}
                />
              </Field>

              <Field label="비밀번호">
                <Input
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  leading={<Icon name="lock" size={20} />}
                  trailing={
                    <TrailingButton type="button" onClick={() => setShowPw((s) => !s)}>
                      <Icon name={showPw ? "eyeOff" : "eye"} size={20} />
                    </TrailingButton>
                  }
                />
              </Field>
            </Fields>

            <RememberRow>
              <RememberLabel>
                <Checkbox $checked={remember} onClick={() => setRemember((r) => !r)}>
                  {remember && <Icon name="check" size={14} color="#fff" strokeWidth={2.6} />}
                </Checkbox>
                자동 로그인
              </RememberLabel>
            </RememberRow>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FullButton type="submit" variant="primary" size="lg" disabled={!can || submitting}>
              {submitting ? "로그인 중…" : "로그인"}
            </FullButton>
          </form>
        </Card>
      </LoginPanel>

      {toast.visible && (
        <Toast>
          <ToastCheck>
            <Icon name="check" size={14} color="#fff" strokeWidth={2.6} />
          </ToastCheck>
          로그인했어요. 잠시만 기다려주세요…
        </Toast>
      )}
    </Page>
  );
}

export default LoginPage;
