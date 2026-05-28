/* useTeacherPicker — 선생님 검색 콤보박스의 상태/핸들러.
   teachers 목록은 인자로 받는다(백엔드 /teachers/general 에서 로드).
   열림 여부, 검색어, 키보드 hover 인덱스, 외부 클릭 닫기, 이름 필터,
   선택/해제/키보드 내비게이션을 한곳에서 관리한다. UI 는 TeacherPicker 가 담당. */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export function useTeacherPicker({ value, onChange, teachers = [] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(0);
  const rootRef = useRef(null);

  const selected = value ? teachers.find((t) => t.id === value) : null;

  // 외부 클릭 시 드롭다운 닫기.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, teachers]);

  const pick = useCallback(
    (teacher) => {
      onChange(teacher.id);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  const clear = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(null);
      setOpen(true);
      setQuery("");
    },
    [onChange],
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHover((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHover((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter" && filtered[hover]) {
        e.preventDefault();
        pick(filtered[hover]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [filtered, hover, pick],
  );

  return {
    open, setOpen,
    query, setQuery,
    hover, setHover,
    rootRef, selected, filtered,
    pick, clear, onKeyDown,
  };
}
