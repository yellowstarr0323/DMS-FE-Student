/* 교사 API — 일반 교사 목록(담당 선생님 선택용).
   GET /teachers/general → { teachers: [{ id, name }] } */

import { api } from "./client.js";

export async function getGeneralTeachers() {
  const data = await api.get("/teachers/general");
  return data?.teachers ?? [];
}
