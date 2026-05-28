/* 학생 API — 내 프로필(헤더 표시용).
   GET /students/profile → { schoolName, name, gcn, profileImageUrl, ... } */

import { api } from "./client.js";

export function getMyProfile() {
  return api.get("/students/profile");
}
