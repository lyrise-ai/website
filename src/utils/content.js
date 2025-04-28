import siteContent from '../data/site-content.json'

export const getSectionContent = (key) => {
  const section = siteContent.sections.find((section) => section.key === key)
  return section?.content
}

export const getSiteMetadata = () => {
  const { title, description, image, keywords } = siteContent
  return { title, description, image, keywords }
}

export default siteContent
