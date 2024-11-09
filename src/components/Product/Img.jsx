// a comopnent to display images without next.js span wrapper
import Image from "next/legacy/image"

export default function Img({
  src,
  alt,
  className,
  width = null,
  height = null,
}) {
  return (
    <div className={className}>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  )
}
