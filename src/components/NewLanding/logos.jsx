import PartnersSlider from '../TopPartners/PartnersSlider'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'

export default function Logos() {
  return (
    <PageSection>
      <PageSectionTitle title="Trusted by the top SMEs in US and EU" />
      <div className="relative bg-white py-10">
        <div className="drop-sides-fade-new z-[150] top-0 w-full h-full absolute" />
        <PartnersSlider />
      </div>
    </PageSection>
  )
}
