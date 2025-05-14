import { getSectionContent, getSiteMetadata } from '../utils/content'

const useSectionsContent = (siteContent) => {
  const getContent = (key) => {
    return getSectionContent(siteContent, key)
  }

  const getMetadata = () => {
    return getSiteMetadata(siteContent)
  }

  return {
    getContent,
    getMetadata,
  }
}

export default useSectionsContent
