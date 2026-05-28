/* useToast — show(message, tone) 호출 시 일정 시간 뒤 자동으로 사라지는 토스트.
   tone 은 "success" | "error" 로, 페이지에서 아이콘/색을 분기하는 데 쓴다. */

import { useState, useRef, useCallback, useEffect } from "react";

export function useToast(durationMs = 1600) {
  const [state, setState] = useState({ visible: false, message: "", tone: "success" });
  const timerRef = useRef(null);

  const show = useCallback(
    (message = "", tone = "success") => {
      setState({ visible: true, message, tone });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState((s) => ({ ...s, visible: false })), durationMs);
    },
    [durationMs],
  );

  // 언마운트 시 대기 중인 타이머 정리.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { visible: state.visible, message: state.message, tone: state.tone, show };
}
