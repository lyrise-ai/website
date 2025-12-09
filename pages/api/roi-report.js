export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    return res.status(response.ok ? 200 : 500).json(data)
  } catch (error) {
    // console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
