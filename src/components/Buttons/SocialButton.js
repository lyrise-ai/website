import Image from 'next/image'

export default function SocialButton({
  children,
  provider,
  onClick,
  iconSrc,
  ...props
}) {
  let providerClasses
  switch (provider) {
    case 'google':
      providerClasses =
        'bg-white hover:bg-gray-100 text-black border border-[#D0D5DD]'
      break
    case 'linkedin':
      providerClasses = 'bg-[#069] hover:bg-sky-900 text-white'
      break
    case 'x':
      providerClasses = 'bg-black hover:bg-neutral-950 text-white'
      break
    case 'instagram':
      providerClasses = 'bg-instagram-gradient text-white'
      break
    case 'facebook':
      providerClasses = 'bg-facebook hover:bg-blue-700 text-white'
      break
    default:
      providerClasses = 'bg-white hover:bg-gray-100 text-black'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      {...props}
      className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg bg font-secondary font-semibold text-base ${providerClasses}`}
    >
      <Image src={iconSrc} alt={`${provider} logo`} width={24} height={24} />
      {children}
    </button>
  )
}
