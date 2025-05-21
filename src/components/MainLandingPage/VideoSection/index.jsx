import React from 'react'

function VideoSection() {
  return (
    <div className="custom-container mb-[10vh] flex items-center justify-center bg-white rounded-[28px] max-w-[90vw] md:max-w-[80vw] w-full h-[80vh] !p-5 px-2  md:p-10 md:px-5">
      <iframe
        className="rounded-[28px]"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/V5heADR5fL4?si=EgLs-YAVrpq9uJLF"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  )
}

export default VideoSection
