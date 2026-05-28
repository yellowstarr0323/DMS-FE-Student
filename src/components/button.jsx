/* Button — 사이즈(sm/md/lg) × 변형(primary/danger/ghost/subtle) 버튼. */

import styled, { css } from "styled-components";

const SIZES = {
  sm: { h: 36, px: 14, fs: 13 },
  md: { h: 44, px: 20, fs: 14 },
  lg: { h: 54, px: 24, fs: 16 },
};

const VARIANTS = {
  primary: css`
    background: ${({ disabled }) => (disabled ? "var(--primary-blue-100)" : "var(--primary-blue-300)")};
    color: #fff;
  `,
  danger: css`
    background: var(--error-300);
    color: #fff;
  `,
  ghost: css`
    background: #fff;
    color: var(--gray-600);
    border: 1px solid var(--gray-300);
  `,
  subtle: css`
    background: var(--system-bg-2);
    color: var(--gray-700);
  `,
};

const StyledButton = styled.button`
  height: ${({ $size }) => SIZES[$size].h}px;
  padding: 0 ${({ $size }) => SIZES[$size].px}px;
  font-size: ${({ $size }) => SIZES[$size].fs}px;
  border-radius: var(--radius-md);
  border: none;
  font-family: var(--font-sans);
  font-weight: 700;
  letter-spacing: var(--tracking);
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  ${({ $variant }) => VARIANTS[$variant]}
`;

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  children,
  onClick,
  disabled,
  icon,
  className,
}) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {icon}
      {children}
    </StyledButton>
  );
}
