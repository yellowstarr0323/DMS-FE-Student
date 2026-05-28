/* HTTP 클라이언트 — 게이트웨이 호출 공통 로직.
   - 베이스: VITE_API_BASE (dev 는 .env.development 에서 dev 백엔드 주소로 직접 호출)
   - 백엔드 Jackson 이 SNAKE_CASE 라서 요청 바디는 camel→snake, 응답은 snake→camel 로 자동 변환
   - 인증 요청에 Authorization: Bearer 자동 첨부
   - 401 이면 refresh-token 으로 1회 재발급 후 재시도, 실패 시 로그아웃 + /login 이동 */

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token.js";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// 백엔드(JacksonConfig: SNAKE_CASE)와 프론트(camelCase) 사이의 키 변환.
function convertKeys(value, mapKey) {
  if (Array.isArray(value)) return value.map((v) => convertKeys(v, mapKey));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [mapKey(k), convertKeys(v, mapKey)]),
    );
  }
  return value;
}
const toSnakeCase = (v) => convertKeys(v, (k) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`));
const toCamelCase = (v) => convertKeys(v, (k) => k.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase()));

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return toCamelCase(JSON.parse(text));
  } catch {
    return text;
  }
}

async function rawRequest(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(toSnakeCase(body)) : undefined,
  });
}

// 동시에 여러 요청이 401 을 받아도 재발급은 한 번만 수행한다.
let reissuePromise = null;

async function reissueTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!reissuePromise) {
    reissuePromise = fetch(`${API_BASE}/auth/reissue`, {
      method: "PUT",
      headers: { "refresh-token": refreshToken },
    })
      .then(async (res) => {
        if (!res.ok) return false;
        setTokens(toCamelCase(await res.json()));
        return true;
      })
      .catch(() => false)
      .finally(() => {
        reissuePromise = null;
      });
  }
  return reissuePromise;
}

function redirectToLogin() {
  clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function request(path, opts = {}) {
  let res = await rawRequest(path, opts);

  if (res.status === 401 && opts.auth !== false) {
    const reissued = await reissueTokens();
    if (reissued) {
      res = await rawRequest(path, opts);
    } else {
      redirectToLogin();
      throw new ApiError(401, "UNAUTHORIZED", "인증이 만료되었어요. 다시 로그인해주세요.");
    }
  }

  if (!res.ok) {
    const data = await parseBody(res);
    const message = data?.message || `요청에 실패했어요 (HTTP ${res.status})`;
    throw new ApiError(res.status, data?.code, message);
  }

  if (res.status === 204) return null;
  return parseBody(res);
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
};
