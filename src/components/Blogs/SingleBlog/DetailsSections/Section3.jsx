import Image from 'next/image'
import React from 'react'
import LinkIcon from '../../../../assets/icons/linkIcon'
import StaticImage from '../../../../assets/staticImages/StaticImage4.png'

function Section3() {
  return (
    <section id="section3" className="w-full flex flex-col">
      <h2 className="text-[#101828] text-[25px] md:text-[30px] font-semibold">
        Other resources
      </h2>

      <p className="text-[#475467] text-[16px] md:text-[18px] font-[400] ">
        Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas
        sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum
        lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at
        diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus
        vulputate gravida id. Sed quis auctor vulputate hac elementum gravida
        cursus dis. Lectus id duis vitae porttitor enim gravida morbi. Eu turpis
        posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel
        in vitae placerat. Suspendisse maecenas ac donec scelerisque diam sed
        est duis purus.
      </p>

      <div className="flex flex-col gap-4 mt-10">
        <div className="w-full h-full flex justify-center">
          <Image src={StaticImage} alt="introImage" />
        </div>
        <div className="flex items-center gap-2">
          <LinkIcon />
          <p className="text-[#475467] text-[14px] font-[400] leading-5">
            Image courtesy of Jasmin Chew via{' '}
            <span className="underline">Pexels</span>
          </p>
        </div>
      </div>

      <p className="text-[#475467] text-[16px] md:text-[18px] font-[400]  mt-10">
        Lectus leo massa amet posuere. Malesuada mattis non convallis quisque.
        Libero sit et imperdiet bibendum quisque dictum vestibulum in non.
        Pretium ultricies tempor non est diam. Enim ut enim amet amet integer
        cursus. Sit ac commodo pretium sed etiam turpis suspendisse at.
        Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit
        duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam
        tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan.
        Cursus viverra aenean magna risus elementum faucibus molestie
        pellentesque. Arcu ultricies sed mauris vestibulum.
      </p>
    </section>
  )
}

export default Section3
