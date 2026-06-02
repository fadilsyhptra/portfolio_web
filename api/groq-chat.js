export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ACCESS DENIED - Fadil AI Security Subsystem</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <link rel="icon" type="image/svg+xml" href="/assets/img/logo.svg">
          <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                  background-color: #0d1117;
                  color: #ff5555;
                  font-family: 'Courier New', Courier, monospace;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  overflow: hidden;
                  text-align: center;
                  padding: 20px;
              }
              .wrapper {
                  max-width: 600px;
                  border: 2px solid #ff5555;
                  padding: 40px 30px;
                  background: rgba(255, 85, 85, 0.03);
                  box-shadow: 0 0 30px rgba(255, 85, 85, 0.15);
                  border-radius: 8px;
              }
              .terminal-header {
                  color: #8b949e;
                  font-size: 0.9rem;
                  margin-bottom: 25px;
                  border-bottom: 1px dashed rgba(255, 85, 85, 0.3);
                  padding-bottom: 10px;
              }
              .icon {
                  font-size: 4.5rem;
                  margin-bottom: 20px;
                  animation: pulse 2s infinite;
              }
              h1 {
                  font-size: 1.8rem;
                  margin-bottom: 15px;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  font-weight: bold;
              }
              p {
                  color: #c9d1d9;
                  font-size: 1rem;
                  line-height: 1.6;
                  margin-bottom: 30px;
              }
              .btn-back {
                  display: inline-block;
                  padding: 12px 25px;
                  color: #0d1117;
                  background-color: #ff5555;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 4px;
                  transition: all 0.3s ease;
                  text-transform: uppercase;
                  font-size: 0.9rem;
                  letter-spacing: 1px;
              }
              .btn-back:hover {
                  background-color: #ff3333;
                  box-shadow: 0 0 20px rgba(255, 85, 85, 0.6);
                  transform: scale(1.02);
              }
              @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.7; }
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
              <div class="terminal-header">🛡️ FADIL_AI_CORE_SECURITY // UNAUTHORIZED_ATTEMPT</div>
              <div class="icon"><i class="fas fa-terminal"></i></div>
              <h1>Akses Tidak Diizinkan!</h1>
              <p>Maaf, Anda tidak memiliki hak otorisasi untuk mengakses direktori database Fadil AI.<br></p>
              <a href="/" class="btn-back">> Kembali ke Portfolio</a>
          </div>
      </body>
      </html>
    `);
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Sistem Error: API Key tidak ditemukan." });
    }

    const personalDataEnv = process.env.PERSONAL_DATA;
    if (!personalDataEnv) {
      return res.status(500).json({ error: "Sistem Error: Brankas data rahasia tidak ditemukan di Vercel." });
    }
    const data = JSON.parse(personalDataEnv);

    const personalKnowledgePrompt = `
      Anda adalah Representasi Kembaran Digital (AI Twin) dari individu berikut:
      Nama Lengkap: ${data.name} (Panggilan: ${data.nickname})
      Profesi/Peran: ${data.role}
      Spesialisasi Kunci: ${data.specialization}
      Lokasi: ${data.location}
      Deskripsi Profil: ${data.about}
      Status Hubungan: ${data.relationship_status}
      Core Belief / Prinsip: "${data.core_belief}"
      
      Sifat & Kepribadian:
      ${data.personality.map(s => `- ${s}`).join('\n')}

      Kompetensi Teknis & Alat (Skills Matrix):
      - Hard Skills: ${data.skills.Hard_Skills.join(', ')}
      - Software & Tools: ${data.skills.Software_Tools.join(', ')}
      - Soft Skills: ${data.skills.Soft_Skills.join(', ')}
      
      Portofolio Proyek Utama:
      ${data.projects.map(p => `- Proyek [${p.title}]: ${p.description} (Tech Stack: ${p.tech.join(', ')})`).join('\n')}
      
      Rekam Jejak Pengalaman & Organisasi:
      ${data.experience.map(e => `- [${e.year}] Sebagai ${e.position} di ${e.company}. Deskripsi: ${e.task}`).join('\n')}
      
      ATURAN PERILAKU, PEMBATASAN TOPIK, & GAYA BICARA AGEN (WAJIB DIPATUHI MUTLAK):
      Tone Suara: ${data.ai_persona.tone}
      Instruksi Wajib:
      ${data.ai_persona.rules.map(r => `- ${r}`).join('\n')}

      PANDUAN BALASAN & ANTI-ROBOTIK (SANGAT KETAT):
      - Jawablah setiap pertanyaan dengan SINGKAT, PADAT, dan LANGSUNG ke inti masalah (to the point). Jika ditanya prodi, sebutkan nama prodinya saja secara jelas, jangan menjabarkan ulang minat atau organisasi Anda.
      - JANGAN PERNAH mengulang-ulang informasi latar belakang (seperti nama kampus, WStudy, TechLab, Machine Learning, atau Data Analytics) di setiap pesan jika hal tersebut tidak sedang ditanyakan atau tidak relevan dengan konteks langsung.
      - SEGERA HENTIKAN kebiasaan membuat kalimat penutup yang bersifat menawarkan bantuan atau mengundang pertanyaan di akhir obrolan (HAPUS total kalimat seperti "Jika ada yang ingin ditanyakan lagi, silakan!", "Yuk tanya tentang proyek saya", atau sejenisnya). Biarkan obrolan terputus secara alami layaknya manusia berkirim pesan teks biasa.
      - Gunakan bahasa Indonesia yang luwes, santai, dan konsisten. Jangan mencampuradukkan gaya formal kaku dengan kata slang secara dipaksakan. Bersikaplah seperti seorang mahasiswa biasa yang sedang mengobrol santai dengan temannya.
      - JIKA DITANYA JURUSAN/PRODI/PROGRAM STUDi: Jawablah dengan "Sistem Telekomunikasi" (atau Telecommunications System). JANGAN PERNAH menjawab Data Analytics atau Machine Learning, karena itu hanya fokus/minat Anda, bukan nama jurusan!

      LARANGAN MUTLAK (ANTI-MET COGNITION ERROR):
      - JANGAN PERNAH menuliskan proses berpikir, analisis aturan, monolog batin, atau teks evaluasi seperti "Okay, the user said...", "I need to respond appropriately...", atau "Let me check the guidelines" di dalam chat!
      - Teks balasan Anda harus LANGSUNG berisi jawaban akhir sebagai FADIL_AI tanpa embel-embel coretan internal apa pun di awalnya.
    `;

    const { chatHistory } = req.body;

    const groqRequestBody = {
      model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      messages: [
        { role: "system", content: personalKnowledgePrompt },
        ...chatHistory
      ],
      temperature: 0.8,
      max_tokens: 1024
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(groqRequestBody)
    });

    const dataGroq = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: dataGroq.error?.message || "Gagal berkomunikasi dengan Groq Cloud." 
      });
    }
    return res.status(200).json(dataGroq);

  } catch (error) {
    return res.status(500).json({ error: `Serverless Internal Error: ${error.message}` });
  }
}