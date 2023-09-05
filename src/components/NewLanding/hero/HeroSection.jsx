import React from 'react'
import ItemsVault from './ItemsVault'

export default function HeroSection() {
  return (
    <div className="flex md:grid grid-cols-3 w-full px-10 relative m-auto mx-10 lg:mx-20">
      {/* <div className="absolute w-full h-full bg-red-500 z-50 left-0 top-0 -translate-x-20">
        <Image src={background} objectFit="cover" width="100%" style={{position: "absolute"}} />
      </div> */}
      <div className="col-span-1 flex flex-col justify-center md:ml-10 lg:ml-20">
        <h1 className="text-5xl font-semibold mb-6">
          Unlock A.I for your Buisness
        </h1>
        <h3 className="find the perfect ai talents pr-5 mb-6 text-neutral-600">
          Find the perfect A.I. talents for your business using LyraAI, our
          proprietary AI chatbot!
        </h3>
        <div className="border-[12px] bg-[#EFF2FF] border-white rounded-[20px] mr-10 p-4 flex flex-col gap-3 w-fit min-w-[20vw]">
          <div className="font-secondary text-[1.1rem] font-semibold">
            Are you in another industry?
          </div>
          <select className="font-secondary text-sm p-2 text-gray-300 rounded border border-gray-300">
            <option defaultValue={true} disabled>
              Select your industry...
            </option>
            <option>Industry 1</option>
            <option>Industry 2</option>
            <option>Industry 3</option>
          </select>
          <button
            className="bg-blue-500 p-3 py-2 text-[1.2rem] font-secondary text-white font-bold rounded-md"
            type="button"
          >
            Book Free Consultation
          </button>
        </div>
      </div>
      <ItemsVault />
    </div>
  )
}
