import Footer from '../src/components/CustomLandingPages/Footer'
import Header from '../src/components/CustomLandingPages/Header'
import HireAiPage from '../src/components/CustomLandingPages/HireAiPage'

export default function TestRoute() {
  return (
    <main className="w-full min-h-screen h-full relative custom-landing-pages flex flex-col">
      <Header />
      <HireAiPage />
      <Footer />
    </main>
  )
}