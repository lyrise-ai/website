import React from 'react'

function ArticleStatistics() {
  return (
    <div className="flex items-center gap-2 border border-[#D0D5DD] py-[3px] ps-[6px] pe-[8px] rounded-[12px]">
      <div className="flex items-center gap-1 border border-[#D0D5DD] p-[2px_8px] rounded-lg shadow-[0px_1px_2px_0px_#1018280D]">
        <div className="bg-[#2957FF] border-[3px] border-[#EFF2FF] rounded-full w-[10px] h-[10px] shadow-[0px_1px_2px_0px_#1018280D]"></div>
        <p className="text-[13px] font-[400] text-[#475467]">Products</p>
      </div>
      <p className="text-[13px] font-[400] text-[#475467] whitespace-nowrap">
        8 Min Read
      </p>
    </div>
  )
}

export default ArticleStatistics
