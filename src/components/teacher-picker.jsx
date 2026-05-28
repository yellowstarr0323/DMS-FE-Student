/* TeacherPicker — 검색형 선생님 콤보박스.
   필드를 누르면 결과가 열리고, 입력으로 이름/학과를 필터링한다.
   상태/핸들러는 useTeacherPicker 훅이 담당하고 여기서는 UI 만 그린다. */

import styled from "styled-components";
import { Icon } from "./icon.jsx";
import { useTeacherPicker } from "../hooks/use-teacher-picker.js";

const Root = styled.div`
  position: relative;
  font-family: var(--font-sans);
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 18px;
  background: var(--gray-100);
  border: 1px solid ${({ $open }) => ($open ? "var(--primary-blue-300)" : "var(--gray-300)")};
  border-bottom: 1px solid ${({ $open }) => ($open ? "var(--gray-200)" : "var(--gray-300)")};
  border-radius: ${({ $open }) => ($open ? "var(--radius-lg) var(--radius-lg) 0 0" : "var(--radius-lg)")};
  cursor: text;
  transition: border-color 0.12s;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--gray-400);
  display: flex;
`;

const SelectedField = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 56px;
  padding: 0 14px 0 16px;
  background: var(--primary-blue-50);
  border: 1px solid var(--primary-blue-300);
  border-radius: var(--radius-lg);
  cursor: pointer;
`;

const Avatar = styled.span`
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: var(--radius-pill);
  background: var(--primary-blue-300);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: var(--tracking);
`;

const SelectedName = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

const SelectedBadge = styled.span`
  padding: 5px 10px;
  background: #fff;
  color: var(--primary-blue-300);
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: var(--tracking);
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: var(--gray-500);
  display: flex;
`;

const Dropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: #fff;
  border: 1px solid var(--primary-blue-300);
  border-top: none;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-dropdown);
  max-height: ${({ $maxHeight }) => $maxHeight}px;
  overflow-y: auto;
  z-index: 20;
`;

const DropdownHeader = styled.div`
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-400);
  letter-spacing: var(--tracking);
  background: var(--system-bg-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Hotkey = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  padding: 32px 18px;
  text-align: center;
  color: var(--gray-400);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: var(--tracking);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  cursor: pointer;
  background: ${({ $hover }) => ($hover ? "var(--system-bg-2)" : "#fff")};
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid var(--gray-200)")};
`;

const RowAvatar = styled.span`
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: var(--radius-pill);
  background: ${({ $selected }) => ($selected ? "var(--primary-blue-300)" : "var(--system-bg-2)")};
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--gray-500)")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: var(--tracking);
`;

const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const RowName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-700);
  letter-spacing: var(--tracking);
`;

export function TeacherPicker({
  value,
  onChange,
  teachers = [],
  placeholder = "선생님 이름으로 검색하세요",
  maxHeight = 280,
}) {
  const {
    open, setOpen,
    query, setQuery,
    hover, setHover,
    rootRef, selected, filtered,
    pick, clear, onKeyDown,
  } = useTeacherPicker({ value, onChange, teachers });

  return (
    <Root ref={rootRef}>
      {!selected || open ? (
        <SearchField $open={open} onClick={() => setOpen(true)}>
          <Icon name="search" size={20} color={open ? "var(--primary-blue-300)" : "var(--system-button)"} />
          <SearchInput
            autoFocus={open}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHover(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
          {query && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
              }}
            >
              <Icon name="xCircle" size={18} />
            </IconButton>
          )}
        </SearchField>
      ) : (
        <SelectedField onClick={() => setOpen(true)}>
          <Avatar>{selected.name[0]}</Avatar>
          <SelectedName>{selected.name} 선생님</SelectedName>
          <SelectedBadge>
            <Icon name="check" size={12} strokeWidth={2.6} />
            선택됨
          </SelectedBadge>
          <ClearButton onClick={clear} title="다시 검색">
            <Icon name="xCircle" size={20} />
          </ClearButton>
        </SelectedField>
      )}

      {open && (
        <Dropdown $maxHeight={maxHeight}>
          <DropdownHeader>
            <span>선생님 {filtered.length}명</span>
            <Hotkey>↑↓ 선택 · Enter 확정</Hotkey>
          </DropdownHeader>

          {filtered.length === 0 && <EmptyState>&quot;{query}&quot; 와 일치하는 선생님이 없어요.</EmptyState>}

          {filtered.map((t, i) => {
            const isSelected = selected?.id === t.id;
            return (
              <Row
                key={t.id}
                $hover={i === hover}
                $last={i === filtered.length - 1}
                onMouseEnter={() => setHover(i)}
                onClick={() => pick(t)}
              >
                <RowAvatar $selected={isSelected}>{t.name[0]}</RowAvatar>
                <RowBody>
                  <RowName>{t.name} 선생님</RowName>
                </RowBody>
                {isSelected && <Icon name="check" size={18} color="var(--primary-blue-300)" strokeWidth={2.6} />}
              </Row>
            );
          })}
        </Dropdown>
      )}
    </Root>
  );
}
