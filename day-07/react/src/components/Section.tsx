import type { ReactNode } from "react"

interface SectionProps {
  title: string
  children: ReactNode
}
function Section({ title, children }: SectionProps)
{
    return (
        <section className="section">
            <h2 className="section-title">{title}</h2>
            <div className="section-body">
                {children}
            </div>
        </section>
    )
}
export default Section