export default function SectionTitle({ title, className }) {
  return (
    <h2
      className={
        'text-[2.6rem] max-w-[600px] m-auto font-semibold mx-auto text-center ' +
        className
      }
    >
      {title}
    </h2>
  )
}
