import siteContent from '../data/site-content.json'

export const getSectionContent = (key) => {
  const section = siteContent.sections.find((section) => section.key === key)
  return section?.content
}

export const getSiteMetadata = () => {
  const { title, description, image, keywords, navbar } = siteContent
  return { title, description, image, keywords, navbar }
}

export default siteContent
