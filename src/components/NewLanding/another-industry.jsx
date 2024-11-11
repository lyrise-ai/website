import Link from 'next/link'

export default function AnotherIndustry() {
  return (
    <div className="mx-auto my-5 border-[12px] bg-[#EFF2FF] border-white rounded-[20px] p-4 flex flex-col gap-3 w-10/12 max-w-4xl">
      {/* First Landing Page launch content - Deprecated */}
      <div className="font-secondary text-[1.1rem] font-semibold">
        Are you in another industry?
      </div>
      <select className="font-secondary text-sm p-2 text-gray-300 rounded border border-gray-300">
        <option selected disabled>
          Select your industry...
        </option>
        <option>Education</option>
        <option>Marketing & Advertising</option>
        <option>Telecommunications</option>
        <option>Entertainment & media</option>
        <option>Insurance</option>
      </select>
      <Link className="w-full" href="/calendar">
        <button
          className="bg-blue-500 p-3 py-2 text-[1.2rem] font-secondary text-white font-bold rounded-md w-full"
          type="button"
        >
          Book Free Consultation
        </button>
      </Link>
    </div>
  )
}
