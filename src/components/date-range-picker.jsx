/* DateRangePicker — 새벽자습 기간 선택용 달력 드롭다운.
   필드를 누르면 월간 달력이 열리고, minDate~maxDate 안의 날짜만 누를 수 있다.
   하루를 누르면 그날 하루, 이어서 다른 날을 누르면 두 날 사이 구간이 선택된다.
   구간이 잡힌 상태에서 누르면 그날 하루로 다시 시작하고, 선택된 하루를 다시 누르면 해제된다.
   날짜는 yyyy-MM-dd 문자열이라 문자열 비교로 대소를 판단한다. */

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "./icon.jsx";

const Root = styled.div`
  position: relative;
  font-family: var(--font-sans);
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  padding: 0 18px;
  background: var(--gray-100);
  border: 1px solid ${({ $open }) => ($open ? "var(--primary-blue-300)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: border-color 0.12s;
`;

const TriggerText = styled.span`
  flex: 1;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: var(--tracking);
  color: ${({ $placeholder }) => ($placeholder ? "var(--gray-400)" : "var(--gray-700)")};
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 340px;
  max-width: 100%;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-dropdown);
  z-index: 20;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MonthLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const NavButton = styled.button`
  display: flex;
  padding: 6px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--gray-500);
  cursor: pointer;

  &:disabled {
    color: var(--gray-300);
    cursor: default;
  }

  &:not(:disabled):hover {
    background: var(--gray-100);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const WeekdayCell = styled.span`
  padding: 6px 0;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const DayCell = styled.button`
  position: relative;
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  letter-spacing: var(--tracking);
  transition: background 0.12s;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  background: ${({ $selected }) => ($selected ? "var(--primary-blue-300)" : "transparent")};
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--gray-700)")};
  cursor: pointer;

  /* 오늘은 숫자 아래 점으로만 표시한다(선택된 날의 파란색과 헷갈리지 않도록). */
  &::after {
    content: "";
    display: ${({ $today }) => ($today ? "block" : "none")};
    position: absolute;
    left: 50%;
    bottom: 5px;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: var(--radius-pill);
    background: ${({ $selected }) => ($selected ? "#fff" : "var(--primary-blue-300)")};
  }

  &:disabled {
    color: ${({ $outside }) => ($outside ? "var(--gray-200)" : "var(--gray-300)")};
    cursor: default;
  }

  &:not(:disabled):hover {
    background: ${({ $selected }) => ($selected ? "var(--primary-blue-400)" : "var(--primary-blue-50)")};
  }
`;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (n) => String(n).padStart(2, "0");
const ymd = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
// yyyy-MM-dd → { y, m(0-based) }
const monthOf = (s) => ({ y: Number(s.slice(0, 4)), m: Number(s.slice(5, 7)) - 1 });
const monthKey = ({ y, m }) => y * 12 + m;

// yyyy-MM-dd → "M/D (요일)"
function label(s) {
  const { y, m } = monthOf(s);
  const d = Number(s.slice(8, 10));
  return `${m + 1}/${d} (${WEEKDAYS[new Date(y, m, d).getDay()]})`;
}

export function DateRangePicker({
  minDate,
  maxDate,
  startDate,
  endDate,
  onChange,
  placeholder = "날짜를 선택하세요",
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => monthOf(startDate || minDate));
  const rootRef = useRef(null);
  const today = (() => {
    const t = new Date();
    return ymd(t.getFullYear(), t.getMonth(), t.getDate());
  })();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setView(monthOf(startDate || minDate));
    setOpen((o) => !o);
  };

  const select = (day) => {
    if (!startDate || startDate !== endDate) return onChange(day, day);
    if (day === startDate) return onChange("", "");
    // 구간이 완성되면 닫는다. 하루짜리는 두 번째 날을 고를 수 있게 열어둔다.
    setOpen(false);
    return day < startDate ? onChange(day, startDate) : onChange(startDate, day);
  };

  // 신청 가능 구간이 걸친 달 사이에서만 이동한다.
  const canPrev = monthKey(view) > monthKey(monthOf(minDate));
  const canNext = monthKey(view) < monthKey(monthOf(maxDate));
  const move = (delta) => {
    const k = monthKey(view) + delta;
    setView({ y: Math.floor(k / 12), m: k % 12 });
  };

  // 앞뒤 빈칸은 이전/다음 달 날짜로 채워 주 단위로 보여준다(신청 주가 월말~월초에 걸쳐도 한 줄에 보이도록).
  const leading = new Date(view.y, view.m, 1).getDay();
  const lastDay = new Date(view.y, view.m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((leading + lastDay) / 7) * 7 }, (_, i) => {
    const d = new Date(view.y, view.m, i - leading + 1);
    return { day: ymd(d.getFullYear(), d.getMonth(), d.getDate()), date: d.getDate(), outside: d.getMonth() !== view.m };
  });

  const text = startDate
    ? startDate === endDate
      ? label(startDate)
      : `${label(startDate)} ~ ${label(endDate)}`
    : placeholder;

  return (
    <Root ref={rootRef}>
      <Trigger type="button" $open={open} onClick={toggle}>
        <Icon name="cal" size={20} color={open ? "var(--primary-blue-300)" : "var(--gray-400)"} />
        <TriggerText $placeholder={!startDate}>{text}</TriggerText>
        <Icon name="chevDown" size={18} color="var(--gray-400)" />
      </Trigger>

      {open && (
        <Popover>
          <Header>
            <NavButton type="button" disabled={!canPrev} onClick={() => move(-1)}>
              <Icon name="chevL" size={18} />
            </NavButton>
            <MonthLabel>
              {view.y}년 {view.m + 1}월
            </MonthLabel>
            <NavButton type="button" disabled={!canNext} onClick={() => move(1)}>
              <Icon name="chevR" size={18} />
            </NavButton>
          </Header>

          <Grid>
            {WEEKDAYS.map((w) => (
              <WeekdayCell key={w}>{w}</WeekdayCell>
            ))}
            {cells.map(({ day, date, outside }) => {
              const selected = Boolean(startDate && endDate && day >= startDate && day <= endDate);
              return (
                <DayCell
                  key={day}
                  type="button"
                  $selected={selected}
                  $today={day === today}
                  $outside={outside}
                  disabled={day < minDate || day > maxDate}
                  onClick={() => select(day)}
                >
                  {date}
                </DayCell>
              );
            })}
          </Grid>
        </Popover>
      )}
    </Root>
  );
}
