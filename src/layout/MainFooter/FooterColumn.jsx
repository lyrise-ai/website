import { useEffect, useState } from 'react'

const FooterColumn = ({ heading, links }) => {
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <div className="flex flex-col gap-2 md:gap-2 w-fit">
      <h3 className="font-[500] text-[20px] md:text-[24px] text-new-black font-primary ">
        {heading}
      </h3>
      <div className="flex flex-col">
        {links.map(({ id, href, text }) => (
          <a
            key={id}
            href={href}
            target={href === '#' || pathname === href ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={(pathname === href && scrollToTop) || undefined}
          >
            <span className="font-normal font-secondary text-[16px] md:text-[18px] text-new-black leading-4">
              {text}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default FooterColumn
