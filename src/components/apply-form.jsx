/* ApplyForm — 담당 선생님 / 유형 / 일정 / 사유 입력 폼.
   teachers, types 는 백엔드에서 로드해 props 로 받는다. 날짜는 yyyy-MM-dd. */

import styled from "styled-components";
import { Field } from "./field.jsx";
import { Textarea } from "./textarea.jsx";
import { Button } from "./button.jsx";
import { Icon } from "./icon.jsx";
import { TeacherPicker } from "./teacher-picker.jsx";
import { DateRangePicker } from "./date-range-picker.jsx";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TypeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TypeChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: var(--radius-pill);
  background: ${({ $selected }) => ($selected ? "var(--primary-blue-300)" : "#fff")};
  border: 1px solid ${({ $selected }) => ($selected ? "var(--primary-blue-300)" : "var(--gray-300)")};
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--gray-600)")};
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: var(--tracking);
  cursor: pointer;
  transition: all 0.12s;
  line-height: 1;
`;

const EmptyTypes = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 640px) {
    justify-content: stretch;

    button {
      width: 100%;
    }
  }
`;

// 시작/종료일(yyyy-MM-dd) 포함 일수.
function diffDays(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms < 0) return null;
  return Math.floor(ms / 86400000) + 1;
}

// Date → yyyy-MM-dd (로컬 기준).
function toYmd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 선택 가능한 날짜 구간. 백엔드 DaybreakStudyApplication.create 와 같은 규칙:
// 새벽자습은 월~목만 운영 — 오늘이 월~목이면 이번 주, 금~일이면 다음 주 월~목. 과거 날짜는 불가.
function applicableWeek(today = new Date()) {
  const dow = today.getDay(); // 0=일 … 6=토
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((dow + 6) % 7));
  if (dow === 0 || dow >= 5) monday.setDate(monday.getDate() + 7);
  const thursday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3);
  const min = monday > today ? monday : today;
  return { minDate: toYmd(min), maxDate: toYmd(thursday) };
}

export function ApplyForm({
  teachers = [],
  types = [],
  teacherId, setTeacherId,
  typeId, setTypeId,
  startDate, setStartDate,
  endDate, setEndDate,
  reason, setReason,
  onSubmit,
  submitting = false,
}) {
  const week = applicableWeek();
  // 페이지를 띄워둔 채 날짜가 넘어가면 이미 고른 날이 과거가 될 수 있다.
  const dateError = [startDate, endDate].some((d) => d && (d < week.minDate || d > week.maxDate))
    ? "선택한 날짜는 더 이상 신청할 수 없어요. 다시 선택해주세요."
    : null;
  const days = diffDays(startDate, endDate);
  const canSubmit =
    Boolean(teacherId && typeId && startDate && endDate && reason.trim()) && !dateError && !submitting;

  return (
    <Form>
      <Field label="담당 선생님" required hint="해당 선생님께 1차 승인 요청이 전달돼요.">
        <TeacherPicker value={teacherId} onChange={setTeacherId} teachers={teachers} />
      </Field>

      <Field label="유형" required hint="새벽자습 유형을 선택해주세요">
        {types.length === 0 ? (
          <EmptyTypes>등록된 유형이 없어요.</EmptyTypes> 
        ) : (
          <TypeRow>
            {types.map((t) => {
              const selected = t.id === typeId;
              return (
                <TypeChip key={t.id} $selected={selected} onClick={() => setTypeId(selected ? null : t.id)}>
                  {selected && <Icon name="check" size={14} color="#fff" strokeWidth={2.6} />}
                  {t.name}
                </TypeChip>
              );
            })}
          </TypeRow>
        )}
      </Field>

      <Field
        label="일정"
        required
        hint="하루만 신청하려면 한 번, 기간은 시작일과 종료일을 차례로 눌러주세요."
        right={days ? `총 ${days}일` : ""}
        error={dateError}
      >
        <DateRangePicker
          minDate={week.minDate}
          maxDate={week.maxDate}
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </Field>

      <Field label="사유" required>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="새벽 자습이 필요한 이유를 적어주세요."
          rows={5}
          max={200}
        />
      </Field>

      <SubmitRow>
        <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
          {submitting ? "신청 중…" : "신청하기"}
        </Button>
      </SubmitRow>
    </Form>
  );
}
