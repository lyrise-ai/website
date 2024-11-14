export default function SectionWrapper({ children, className, title }) {
  return (
    <section
      className={`rounded-lg overflow-hidden
      border border-neutral-200
      w-full
      flex flex-col items-center justify-center
      px-4 py-3 gap-3
      ${className}`}
    >
      {title && (
        <h2 className="font-bold font-primary text-xl w-full text-center">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
