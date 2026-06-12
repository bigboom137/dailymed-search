// api/proxy.js
export default async function handler(req, res) {
  // 1. Get the DailyMed URL from the frontend request
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    // 2. The Server fetches the data from DailyMed (CORS does not exist here!)
    const response = await fetch(targetUrl);
    
    // 3. Check what type of data it is (JSON or XML)
    const contentType = response.headers.get('content-type');
    const data = contentType.includes('application/json') 
      ? await response.json() 
      : await response.text();

    // 4. Send the data back to your frontend, attaching permissive CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).send(data);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from DailyMed' });
  }
}