import Img from '../../Product/Img'

export default function ExpertCard({
  name,
  imgSrc,
  title,
  workedAtImages,
  className,
}) {
  return (
    <div
      className={`w-[85vw] h-[85vw] md:w-[15vw] md:h-[15vw] border-[12px] p-2 md:p-3 lg:p-5 border-white bg-[#EFF2FF] text-center rounded-[20px] flex flex-col justify-center ${className}`}
      style={{
        boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)',
      }}
    >
      <Img
        className="w-[45%] h-[45%] flex-shrink-0 md:w-1/2 md:h-1/2 mx-auto object-cover border-2 border-white rounded-full overflow-hidden mb-3"
        alt={name}
        src={imgSrc}
      />
      {/* </div> */}
      <div className="font-secondary text-black text-xs md:text-sm">{name}</div>
      <div className="font-secondary text-black text-[0.8rem] md:text-[1rem] font-semibold">
        {title}
      </div>
      <div className="font-secondary text-black text-xs">
        Previously Worked At:
        <div className="flex gap-3 justify-center">
          {workedAtImages.map((src) => (
            <Img
              key={src}
              src={src}
              alt={src}
              className="w-6 h-6 object-cover mt-2"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
