import Layout from '@components/Layout/Layout'
import { sections } from './sections.config'

/**
 * DynamicPage component - renders a page using provided config.
 * @param {object} config - The configuration generated using PageBuilder class
 */
export default function DynamicPage({ config }) {
  if (!config) {
    throw new Error('No config provided for DynamicPage')
  }

  const pageSections = config.map(([section, props]) => {
    const Section = sections.get(section)
    return <Section key={section} {...props} />
  })
  return (
    <Layout isRaw={true}>
      <div className="w-full h-fit new-landing-container">{pageSections}</div>
    </Layout>
  )
}
