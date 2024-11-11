// import all sections that can exist in a landing page
import Security from '@components/NewLanding/security'
import HowItWorks from '@components/NewLanding/how-it-works/HowItWorks'
import ExpertNetwork from '@components/NewLanding/expert-network/ExpertNetwork'
import Solutions from '@components/NewLanding/solutions/Solutions'
import BackedBy from '@components/NewLanding/backed-by'
import Testimonials from '@components/NewLanding/testimonials'

export const sections = new Map([
  ['security', Security],
  ['how-it-works', HowItWorks],
  ['expert-network', ExpertNetwork],
  ['solutions', Solutions],
  ['backed-by', BackedBy],
  ['testimonials', Testimonials],
])
