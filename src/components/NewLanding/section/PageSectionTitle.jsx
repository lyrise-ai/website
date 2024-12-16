export default function PageSectionTitle({ title, subtitle }) {
  return (
    <>
      {subtitle && (
        <h3 className="text-neutral-500 font-secondary mb-3 text-center text-balance text-base lg:text-xl">
          {subtitle}
        </h3>
      )}
      {title && (
        <h1 className="text-2xl lg:text-4xl text-center text-balance max-w-[600px] m-auto font-medium mb-5 md:mb-20 font-primary max-sm:max-w-[90%]">
          {title}
        </h1>
      )}
    </>
  )
}
