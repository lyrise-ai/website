import PartnersSlider from '../TopPartners/PartnersSlider'

export default function Logos() {
  return (
    <div className="mt-52 mb-10">
      {/* <h1 className="text-center text-3xl md:text-4xld lg:text-5xl font-primary-500 font-bold capitalize mb-5">
        LyRise Top Parteners
      </h1> */}
      <div className="relative bg-white py-10">
        <div className="drop-sides-fade-new z-[150] w-full h-full absolute" />
        <PartnersSlider />
      </div>
    </div>
  )
}
