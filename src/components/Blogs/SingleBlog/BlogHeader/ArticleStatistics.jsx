import React from 'react'

function ArticleStatistics() {
  return (
    <div className="flex items-center gap-2 border border-[#D0D5DD] py-[2px] sm:py-[4px] ps-[3px] sm:ps-[8px] pe-[8px] sm:pe-[10px] rounded-[12px] font-secondary">
      <div className="flex items-center gap-1 border border-[#D0D5DD] p-[2px_8px] rounded-lg shadow-[0px_1px_2px_0px_#1018280D]">
        <div className="bg-[#2957FF] border-[3px] border-[#EFF2FF] rounded-full w-[10px] h-[10px] shadow-[0px_1px_2px_0px_#1018280D]"></div>
        <p className="text-[12px] sm:text-[13px] font-[400] text-[#475467]">
          Products
        </p>
      </div>
      <p className="text-[12px] sm:text-[13px] font-[400] text-[#475467] whitespace-nowrap">
        8 Min Read
      </p>
    </div>
  )
}

export default ArticleStatistics
