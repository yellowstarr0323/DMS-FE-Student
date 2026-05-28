import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// dev 백엔드(https://dev-api-dms.dsmhs.kr)는 CORS 로 localhost:3000 출처를 허용한다.
// 그래서 Vite 를 3000 으로 띄우고, API 는 프록시 없이 dev 서버로 직접 호출한다.
// (호출 베이스 URL 은 .env.development 의 VITE_API_BASE 로 지정)
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-styled-components", { displayName: true, ssr: false }]],
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});
