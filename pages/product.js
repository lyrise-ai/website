// import './App.css'
import Header from '../src/components/Product/Header'
import Logos from '../src/components/Product/Logos'
import How from '../src/components/Product/How'
import Stories from '../src/components/Product/Stories'
import Testimonials from '../src/components/Product/Testimonials'

import Layout from '../src/components/Layout/Layout'

export default function Product() {
  return (
    // <div className="flex flex-col gap-10">
    // </div>
    <Layout isRaw>
      {/* <Navbar /> */}
      <Header />
      <Logos />
      {/* <PartnersSlider /> */}
      <WrapperWithTitle
        raw
        title="How It Works"
        subtitle={
          <>
            <div className="hidden md:block">
              Bringing you closer to your talent and company goals.
            </div>
            <div className="md:hidden pl-10 pr-10">
              Diverse Talent Pool. Faster Recruitment Process.
            </div>
          </>
        }
        component={<How />}
      />
      <WrapperWithTitle
        title={
          <>
            <div className="hidden md:block">Success Stories</div>
            <div className="md:hidden pl-10 pr-10">Our Success Stories</div>
          </>
        }
        subtitle={
          <>
            <div className="hidden md:block">
              Companies that loved our solutions
            </div>
            <div className="md:hidden pl-10 pr-10">
              Hire In less than two weeks.
            </div>
          </>
        }
        component={<Stories />}
      />
      <WrapperWithTitle
        title="Testimonials"
        subtitle="What our clients say about us."
        component={<Testimonials />}
        className="bg-white md:bg-transparent m-5 md:m-0 rounded-2xl md:rounded-none border-primary border-4 md:border-0"
      />
    </Layout>
  )
}

// export default App;

function WrapperWithTitle({ component, title, subtitle, className = '' }) {
  return (
    <div className={className}>
      <h1 className="text-center text-3xl md:text-4x lg:text-[2rem] font-primary-500 pt-10 font-bold capitalize">
        {title}
      </h1>
      <h3 className="text-center text-xl md:text-2x lg:text-3x font-secondary pt-5 pb-5 text-gray-500 font-semibold">
        {subtitle}
      </h3>
      {component}
    </div>
  )
}
