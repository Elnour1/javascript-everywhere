import type { ReactNode } from "react";

export interface SectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode; // الخاصية الاختيارية الجديدة
}

export function Section({ title, children, action }: SectionProps) {
  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {action && <div className="section-action">{action}</div>}
      </div>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

export default Section;