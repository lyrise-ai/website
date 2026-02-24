export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nUrl) throw new Error('N8N_WEBHOOK_URL env var is not set')

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
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
