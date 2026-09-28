/* App — 라우트 정의. 로그인(/login) → 신청(/apply).
   /apply 는 토큰이 있어야 접근 가능(RequireAuth), 그 외 경로는 로그인으로 보낸다. */

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import { isAuthenticated } from "./api/token.js";

// 인증 여부는 반드시 컴포넌트 안에서 판단한다. App 은 경로가 바뀌어도 다시 렌더되지 않으므로
// App 에서 element 를 만들 때 isAuthenticated() 를 부르면 첫 렌더 시점 값에 고정된다
// (로그아웃 후에도 /login 이 /apply 로 보내 /apply ↔ /login 무한 반복).
function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  return isAuthenticated() ? <Navigate to="/apply" replace /> : children;
}

function RootRedirect() {
  return <Navigate to={isAuthenticated() ? "/apply" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/apply"
        element={
          <RequireAuth>
            <ApplyPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
