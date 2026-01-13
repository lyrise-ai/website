import { nanoid } from 'nanoid'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const submissionId = nanoid()
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers.host
    const feedbackLink = `${protocol}://${host}/roi-feedback?id=${submissionId}`

    console.log('Generated Link:', feedbackLink)

    const n8nUrl =
      process.env.NODE_ENV === 'development'
        ? process.env.N8N_WEBHOOK_URL_test
        : process.env.N8N_WEBHOOK_URL ||
          'https://marcbanoub.app.n8n.cloud/webhook/roi-gen'

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        submissionId,
        feedbackLink,
      }),
    })

    const contentType = response.headers.get('content-type')
    let data

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
    } catch (error) {
      data = {}
    }

    return res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
