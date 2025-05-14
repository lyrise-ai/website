export const getSectionContent = (siteContent, key) => {
  const section = siteContent?.sections.find((section) => section.key === key)
  return section?.content
}

export const getSiteMetadata = (siteContent) => {
  const { title, description, image, keywords, navbar } = siteContent || {}
  return { title, description, image, keywords, navbar }
}
