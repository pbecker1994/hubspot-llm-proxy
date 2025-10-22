export default async function handler(req, res) {
    // CORS Headers - erlaubt Zugriff von überall
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            success: false 
        });
    }
    
    try {
        // Get URL from request body
        const { url } = req.body;
        
        // Validate URL
        if (!url) {
            return res.status(400).json({ 
                error: 'URL parameter is required',
                success: false 
            });
        }
        
        // Check if URL is valid
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ 
                error: 'Invalid URL format',
                success: false 
            });
        }
        
        // Fetch the URL content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Return the content
        return res.status(200).json({
            content: html,
            success: true,
            contentLength: html.length,
            url: url
        });
        
    } catch (error) {
        console.error('Fetch error:', error);
        return res.status(500).json({
            error: error.message,
            success: false
        });
    }
}
Add fetch-url API endpoint
