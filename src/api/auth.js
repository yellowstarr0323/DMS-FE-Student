/* 인증 API — 로그인 / 로그아웃.
   POST /auth/tokens 는 토큰 없이 호출(permit-all)하고, 성공 시 토큰을 저장한다. */

import { api } from "./client.js";
import { setTokens, clearTokens } from "./token.js";

export async function signIn({ accountId, password, deviceToken = null }) {
  const data = await api.post(
    "/auth/tokens",
    { accountId, password, deviceToken },
    { auth: false },
  );
  setTokens(data);
  return data;
}

export function signOut() {
  clearTokens();
}
