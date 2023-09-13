import Image from 'next/image'

import leftImg from '/src/assets/security/left.png'
import centerImg from '/src/assets/security/center.png'
import rightImg from '/src/assets/security/right.png'

function Security() {
  return (
    <div className="text-center w-full mt-32">
      <h3 className="text-neutral-500 font-secondary mb-3">
        Data Security & Infrastructure
      </h3>
      <h1 className="text-4xl max-w-[500px] m-auto font-semibold mb-20">
        Elevate Your Data Security with IBM Hyper Protect Infrastructure
      </h1>

      <div className="md:grid gap-5 grid-cols-4 max-w-[1200px] m-auto">
        <div className="col-span-1 hidden md:block">
          <Image src={leftImg} />
        </div>
        <div
          className="col-span-2 flex gap-5 rounded-lg border-[4px] border-white bg-[#EFF2FF] p-3"
          style={{ boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)' }}
        >
          <div className="text-left flex-1 flex md:flex-col justify-center">
            <div className="text-[1rem] font-semibold font-secondary mb-3">
              Confidential Lifecycle
            </div>
            <div className="text-[1rem] font-secondary text-neutral-500 mb-3">
              Utilize Secure Service Container technology to maintain data
              integrity throughout its journey. Data remains secure in storage
              and transit, accessible only to authorized parties.
            </div>
            <button
              className="bg-blue-500 p-3 py-2 text-[1rem] font-secondary text-white font-bold rounded-md w-fit"
              type="button"
            >
              Get Started
            </button>
          </div>
          <Image
            src={centerImg}
            width={280}
            height={200}
            style={{ flexShrink: 0, flex: 1 }}
          />
        </div>
        <div className="col-span-1 hidden md:block">
          <Image src={rightImg} />
        </div>
      </div>
    </div>
  )
}

export default Security
