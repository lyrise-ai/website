import axios from 'axios'

const GITHUB_API_BASE = process.env.NEXT_PUBLIC_GITHUB_API_BASE
const REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER
const REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

const githubService = {
  async createNewRoute(routeName, jsonContent) {
    try {
      // 1. Create the route component file
      const componentContent = generateComponentContent(routeName, jsonContent)
      console.log(jsonContent)
      await createFile(`src/data/${routeName}.json`, jsonContent)
      await createFile(`pages/${routeName}.js`, componentContent)

      // 2. Create the route configuration
      // const routeConfig = generateRouteConfig(routeName)
      // await createFile(`src/routes/${routeName}.js`, routeConfig)

      // 3. Update the main routes file to include the new route
      // await updateMainRoutes(routeName)

      return true
    } catch (error) {
      console.error('Error creating new route:', error)
      throw error
    }
  },
}

async function createFile(path, content) {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`

  // Convert content to string if it's an object
  const contentString =
    typeof content === 'object' ? JSON.stringify(content, null, 2) : content

  // Properly encode the content to handle Unicode characters
  const encodedContent = btoa(unescape(encodeURIComponent(contentString)))

  const response = await axios.put(
    url,
    {
      message: `Add new page: ${path}`,
      content: encodedContent,
      branch: 'main',
    },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  )

  return response.data
}

function generateComponentContent(routeName, jsonContent) {
  const componentName = routeName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `import Footer from '../src/components/CustomLandingPages/Footer'
import Header from '../src/components/CustomLandingPages/Header'
import HireAiPage from '../src/components/CustomLandingPages/HireAiPage'
import siteContent from '../src/data/${routeName}.json'

export default function ${componentName}() {
  return (
    <main className="w-full min-h-screen h-full relative custom-landing-pages flex flex-col">
      <Header  siteContent={siteContent}/>
      <HireAiPage siteContent={siteContent} />
      <Footer />
    </main>
  )
}`
}

function generateRouteConfig(routeName) {
  const componentName = routeName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `import ${componentName} from '../components/${routeName}/${routeName}';

export default {
  path: '/${routeName}',
  element: <${componentName} />
};`
}

function addRouteToMainFile(currentContent, routeName) {
  const importStatement = `import ${routeName}Route from './${routeName}';\n`
  const routeObject = `  '/${routeName}': ${routeName}Route,\n`

  // Add import statement after the last import
  const importIndex = currentContent.lastIndexOf('import')
  const importEndIndex = currentContent.indexOf('\n', importIndex) + 1
  const newContent =
    currentContent.slice(0, importEndIndex) +
    importStatement +
    currentContent.slice(importEndIndex)

  // Add route to the routes object
  const routesIndex = newContent.indexOf('const routes = {')
  const routesEndIndex = newContent.indexOf('};', routesIndex) + 1

  return (
    newContent.slice(0, routesEndIndex - 1) +
    routeObject +
    newContent.slice(routesEndIndex - 1)
  )
}

export default githubService
