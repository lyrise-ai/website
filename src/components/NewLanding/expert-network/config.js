// experts imgsrcs
import jonathanImg from '../../../assets/hero/experts/jonathan.jpeg'
import karimImg from '../../../assets/hero/experts/karim.jpeg'
import ahmedSamirImg from '../../../assets/hero/experts/karim2.png'
import loayImg from '../../../assets/hero/experts/loay.jpeg'
import omarImg from '../../../assets/hero/experts/omar.jpeg'

// companies
import cfImg from '../../../assets/hero/companies/cf.png'
import pgImg from '../../../assets/hero/companies/p&g.png'
import pwcImg from '../../../assets/hero/companies/pwc.png'
import symplImg from '../../../assets/hero/companies/sympl.png'
import udacityImg from '../../../assets/hero/companies/udacity.png'
import userpilotImg from '../../../assets/hero/companies/userpilot.png'
import visaImg from '../../../assets/hero/companies/visa.png'
import vodafoneImg from '../../../assets/hero/companies/vodafone.png'

export const EXPERTS = [
  {
    id: 'loay-amin',
    name: 'Loay Amin',
    title: 'AI Solution Architect',
    companies: ['PwC', 'Udacity'],
    companiesImgs: [pwcImg, udacityImg],
    imgSrc: loayImg,
  },
  {
    id: 'karim-tawfik',
    name: 'Karim Tawfik',
    title: 'Co-Founder & CTO',
    companies: ['Sympl', 'Visa'],
    companiesImgs: [symplImg, visaImg],
    imgSrc: karimImg,
  },
  {
    id: 'ahmed-samir-tawfik',
    name: 'Ahmed Samir Roshdy',
    title: 'Data Science Expert',
    companies: ['Vodafone'],
    companiesImgs: [vodafoneImg],
    imgSrc: ahmedSamirImg,
  },
  {
    id: 'jonathan-hodges',
    name: 'Jonathan Hodges',
    title: 'Generative AI Expert',
    companies: ['Userpilot'],
    companiesImgs: [userpilotImg],
    imgSrc: jonathanImg,
  },
  {
    id: 'omar-kamal',
    name: 'Omar Kamal',
    title: 'Data Science Expert',
    companies: ['Procter & Gamble', 'Career Foundry'],
    companiesImgs: [pgImg, cfImg],
    imgSrc: omarImg,
  },
]
