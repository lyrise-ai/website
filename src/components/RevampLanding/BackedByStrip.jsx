/* eslint-disable @next/next/no-img-element */
import React from 'react'

/**
 * BackedByStrip
 *
 * Converted to pure Tailwind CSS:
 * - Enterprise backer and accelerator logos
 * - Balanced optical heights so tall logos (Forbes 30u30) don't overpower wide logos
 * - Grayscale-to-color hover transition
 */
export default function BackedByStrip() {
  const logos = [
    {
      name: 'Google for Startups',
      src: '/assets/site/google-for-startups.png',
      className: 'h-5 md:h-6 max-w-[140px]',
    },
    {
      name: 'Microsoft for Startups',
      src: '/assets/site/microsoft-for-startups.png',
      className: 'h-6 md:h-7 max-w-[130px]',
    },
    {
      name: 'Techstars & J.P. Morgan',
      src: '/assets/site/techstars-jpmorgan.png',
      className: 'h-6 md:h-7 max-w-[110px]',
    },
    {
      name: 'Forbes 30 Under 30',
      src: '/assets/site/forbes-30u30.png',
      className: 'h-7 md:h-8 max-w-[70px]',
    },
    {
      name: 'MIT Media Lab',
      src: '/assets/site/mit-media-lab.png',
      className: 'h-6 md:h-7 max-w-[90px]',
    },
    {
      name: 'Mastercard',
      src: '/assets/site/mastercard.png',
      className: 'h-6 md:h-7 max-w-[100px]',
    },
    {
      name: 'Meta',
      src: '/assets/site/meta.png',
      className: 'h-5 md:h-6 max-w-[90px]',
    },
  ]

  return (
    <div className="bg-white border-b border-[#000022]/8 py-8 px-6">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8c909e] text-center font-sans">
          Backed &amp; Recognized By World-Class Enterprise Leaders
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-11">
          {logos.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className={`${logo.className} w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200 object-contain`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
