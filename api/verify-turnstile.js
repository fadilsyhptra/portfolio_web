export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Token is required' });
  }

  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      }
    );

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return res.status(403).json({ success: false, error: 'Turnstile verification failed' });
    }

    const cookieName = 'secure_chat_session';
    const cookieValue = 'authorized';
    const maxAge = 20 * 60; 

    res.setHeader(
      'Set-Cookie',
      `${cookieName}=${cookieValue}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}