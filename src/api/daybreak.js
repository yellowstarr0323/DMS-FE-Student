/* 새벽자습 API — 유형 조회 / 내 최신 신청 / 신청하기.
   - GET /daybreaks/study-type → { types: [{ id, name }] }
   - GET /daybreaks/study-application/my → { status, startDate, endDate } (없으면 404)
   - POST /daybreaks/study-application { teacherId, typeId, reason, startDate, endDate } */

import { api, ApiError } from "./client.js";

export async function getStudyTypes() {
  const data = await api.get("/daybreaks/study-type");
  return data?.types ?? [];
}

// 최신 신청이 없으면 백엔드가 404 를 주므로 null 로 정규화한다.
export async function getMyApplication() {
  try {
    return await api.get("/daybreaks/study-application/my");
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export function applyStudyApplication({ teacherId, typeId, reason, startDate, endDate }) {
  return api.post("/daybreaks/study-application", {
    teacherId,
    typeId,
    reason,
    startDate,
    endDate,
  });
}
