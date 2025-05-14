import { getSectionContent, getSiteMetadata } from '../utils/content'

const useSectionsContent = () => {
  const getContent = (key) => {
    return getSectionContent(key)
  }

  const getMetadata = () => {
    return getSiteMetadata()
  }

  return {
    getContent,
    getMetadata,
  }
}

export default useSectionsContent
