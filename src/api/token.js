/* 토큰 스토어 — accessToken / refreshToken 을 localStorage 에 보관한다.
   게이트웨이는 Authorization: Bearer <accessToken> 을 받고, 만료 시
   refresh-token 헤더로 /auth/reissue 한다. */

const ACCESS_KEY = "dms_access_token";
const REFRESH_KEY = "dms_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
