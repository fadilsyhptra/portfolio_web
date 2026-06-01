export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Sistem Error: API Key tidak ditemukan." });
    }

    const requestBody = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || "Gagal berkomunikasi dengan Groq Cloud." 
      });
    }
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: `Serverless Internal Error: ${error.message}` });
  }
}