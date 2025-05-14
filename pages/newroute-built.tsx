import Footer from '../src/components/CustomLandingPages/Footer';
import Header from '../src/components/CustomLandingPages/Header';
import HireAiPage from '../src/components/CustomLandingPages/HireAiPage';
import siteContent from '../src/data/newroute-built.json';

export default function NewrouteBuilt() {
  return (
    <main className="w-full min-h-screen h-full relative custom-landing-pages flex flex-col">
      <Header siteContent={siteContent} />
      <HireAiPage siteContent={siteContent} />
      <Footer />
    </main>
  );
}