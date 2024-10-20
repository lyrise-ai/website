import React from 'react'

import SwiperImagesComponent from '../shared/Swiper/SwiperImagesComponent'

const SilverbulletGray = '/assets/GrayLogos/silver_bulletgray.png'
const QuantraxGray = '/assets/GrayLogos/quantraxgray.png'
const BrimoreGray = '/assets/GrayLogos/brimoregray.png'
const NeoTaxGray = '/assets/GrayLogos/neotaxgray.png'
const RushGray = '/assets/GrayLogos/rushgray.png'
const LinumGray = '/assets/GrayLogos/linumgray.png'
const Silverbullet = '/assets/Logos/silver_bullet.png'
const Quantrax = '/assets/Logos/quantrax.png'
const Brimore = '/assets/Logos/brimore.png'
const NeoTax = '/assets/Logos/neotax.png'
const Rush = '/assets/Logos/rush.png'
const Linum = '/assets/Logos/linum.png'

const images = [
  { id: '1', greyImage: RushGray, image: Rush },
  { id: '2', greyImage: QuantraxGray, image: Quantrax },
  { id: '3', greyImage: SilverbulletGray, image: Silverbullet },
  { id: '4', greyImage: LinumGray, image: Linum },
  { id: '5', greyImage: BrimoreGray, image: Brimore },
  { id: '6', greyImage: NeoTaxGray, image: NeoTax },
  { id: '7', greyImage: RushGray, image: Rush },
  { id: '8', greyImage: QuantraxGray, image: Quantrax },
  { id: '9', greyImage: SilverbulletGray, image: Silverbullet },
  { id: '10', greyImage: LinumGray, image: Linum },
  { id: '11', greyImage: BrimoreGray, image: Brimore },
  { id: '12', greyImage: NeoTaxGray, image: NeoTax },
]

export default function PartnersSlider() {
  return <SwiperImagesComponent images={images} />
}
