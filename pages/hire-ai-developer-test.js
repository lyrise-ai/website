import Footer from '../src/components/CustomLandingPages/Footer'
import Header from '../src/components/CustomLandingPages/Header'
import HireAiPage from '../src/components/CustomLandingPages/HireAiPage'
import siteContent from '../src/data/site-content.json'

export default function HireAIDeveloper() {
  return (
    <main className="w-full min-h-screen h-full relative custom-landing-pages flex flex-col">
      <Header siteContent={siteContent} />
      <HireAiPage siteContent={siteContent} />
      <Footer />
    </main>
  )
}
