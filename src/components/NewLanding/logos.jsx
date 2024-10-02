import PartnersSlider from '../TopPartners/PartnersSlider'

export default function Logos() {
  return (
    <div className="mt-20 lg:mt-52 mb-10">
      <h1 className="text-3xl lg:text-4xl max-w-[700px] m-auto font-medium mb-20 font-primary max-sm:max-w-[90%] text-center">
        Trusted by the top SMEs in US and EU
      </h1>
      <div className="relative bg-white py-10">
        <div className="drop-sides-fade-new z-[150] top-0 w-full h-full absolute" />
        <PartnersSlider />
      </div>
    </div>
  )
}
