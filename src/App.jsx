/* App — 라우트 정의. 로그인(/login) → 신청(/apply).
   /apply 는 토큰이 있어야 접근 가능(RequireAuth), 그 외 경로는 로그인으로 보낸다. */

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import { isAuthenticated } from "./api/token.js";

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/apply"
        element={
          <RequireAuth>
            <ApplyPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
