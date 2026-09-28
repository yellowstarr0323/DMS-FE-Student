/* 토큰 스토어 — accessToken / refreshToken 보관.
   자동 로그인이면 localStorage(브라우저를 꺼도 유지), 아니면 sessionStorage(탭/브라우저를 닫으면 삭제).
   게이트웨이는 Authorization: Bearer <accessToken> 을 받고, 만료 시
   refresh-token 헤더로 /auth/reissue 한다. */

const ACCESS_KEY = "dms_access_token";
const REFRESH_KEY = "dms_refresh_token";

// 토큰이 들어있는 저장소. 로그인 전이면 localStorage.
function currentStorage() {
  return sessionStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(ACCESS_KEY) ? sessionStorage : localStorage;
}

export function getAccessToken() {
  return currentStorage().getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return currentStorage().getItem(REFRESH_KEY);
}

// remember 를 넘기면(로그인 시) 저장소를 새로 고르고, 생략하면(재발급 시) 지금 저장소를 유지한다.
export function setTokens({ accessToken, refreshToken }, { remember } = {}) {
  let storage = currentStorage();
  if (remember !== undefined) {
    clearTokens();
    storage = remember ? localStorage : sessionStorage;
  }
  if (accessToken) storage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) storage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(ACCESS_KEY);
    storage.removeItem(REFRESH_KEY);
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
