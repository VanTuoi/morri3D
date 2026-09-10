import type { IncomingMessage, ServerResponse } from 'http'

// Helper to parse query parameters and body from request
async function getRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {})
            } catch {
                resolve({ raw: body })
            }
        })
    })
}

export default async function handler(req: IncomingMessage & { query?: Record<string, string>; body?: any }, res: ServerResponse) {
    // Set CORS headers if needed
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.statusCode = 200
        res.end()
        return
    }

    const gasUrl = process.env.GAS_URL || process.env.VITE_GAS_URL
    const apiKey = process.env.API_SECRET_KEY || ''

    if (!gasUrl) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
            JSON.stringify({
                success: false,
                error: 'Server missing GAS_URL environment variable'
            })
        )
        return
    }

    try {
        if (req.method === 'GET') {
            const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
            const action = urlObj.searchParams.get('action') || 'getAll'
            const email = urlObj.searchParams.get('email') || ''

            const targetUrl = new URL(gasUrl)
            targetUrl.searchParams.set('action', action)
            if (email) targetUrl.searchParams.set('email', email)
            if (apiKey) targetUrl.searchParams.set('apiKey', apiKey)

            const response = await fetch(targetUrl.toString(), {
                method: 'GET',
                redirect: 'follow'
            })

            const data = await response.json()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return
        }

        if (req.method === 'POST') {
            const body = req.body || (await getRequestBody(req))
            const payload = {
                ...body,
                ...(apiKey ? { apiKey } : {})
            }

            const response = await fetch(gasUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(payload),
                redirect: 'follow'
            })

            const data = await response.json()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return
        }

        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
    } catch (err: any) {
        console.error('Vercel API Error:', err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
            JSON.stringify({
                success: false,
                error: err?.message || 'Lỗi kết nối tới Google Apps Script'
            })
        )
    }
}
