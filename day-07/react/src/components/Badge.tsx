import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "warning" | "danger";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`}>
      {children}
    </span>
  );
}