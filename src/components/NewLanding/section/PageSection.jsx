// this container applies landing page vertical spacing
export default function PageSection({ children, className }) {
  return (
    <section className={`w-full mx-auto mb-10 md:mb-20 ${className}`}>
      {children}
    </section>
  )
}
