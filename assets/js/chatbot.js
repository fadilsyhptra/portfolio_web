/**
 * CORE AGENT DIGITAL TWIN - INTEGRASI GROQ API MURNI VANILLA JS (TACTICAL HUD v1.0)
 */

const GROQ_CONFIG = {
  // PENTING: Ganti string di bawah ini dengan API Key resmi dari Groq Dashboard Anda (gsk_...)
  API_KEY: "MASUKKAN_API_KEY_GROQ_ANDA_DI_SINI",
  ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",
  MODEL: "llama-3.3-70b-versatile"
};

let personalKnowledgePrompt = "";

// 1. Ekstraksi Data Konteks Kognitif dari File JSON Lokal
async function loadPersonalKnowledgeBase() {
  try {
    const response = await fetch('./assets/data/personal_data.json');
    if (!response.ok) throw new Error('Gagal mengakses data repositori lokal.');
    
    const data = await response.json();
    
    // Transformasi data JSON menjadi String Konteks terstruktur untuk dimasukkan ke Sistem Prompt AI
    personalKnowledgePrompt = `
      Anda adalah Representasi Kembaran Digital dari individu berikut:
      Nama: ${data.name}
      Profesi: ${data.role}
      Spesialisasi Kunci: ${data.specialization}
      Lokasi: ${data.location}
      Deskripsi Profil: ${data.about}
      
      Kompetensi Teknis:
      - Languages: ${data.skills.Technical.join(', ')}
      - AI & ML Infrastructure: ${data.skills.AI_ML.join(', ')}
      - Development Tools: ${data.skills.Tools.join(', ')}
      
      Portofolio Proyek Utama:
      ${data.projects.map(p => `- Proyek [${p.title}]: ${p.description} (Tech Stack: ${p.tech.join(', ')})`).join('\n')}
      
      Rekam Jejak Kerja & Prestasi:
      - Pengalaman: ${data.experience.map(e => `${e.year}: ${e.position} di ${e.company}. Tugas: ${e.task}`).join('\n')}
      - Penghargaan: ${data.achievements.join(', ')}
      
      ATURAN PERILAKU & GAYA BICARA AGEN:
      Tone Suara: ${data.ai_persona.tone}
      Instruksi Wajib:
      ${data.ai_persona.rules.map(r => `- ${r}`).join('\n')}
    `;
    console.log("Knowledge Base System injected successfully.");
  } catch (error) {
    console.error("Critical AI Base Error:", error);
    personalKnowledgePrompt = "Anda adalah asisten AI dari Muhammad Fadil Syahputra, namun gagal memuat data biografi lengkap secara dinamis.";
  }
}

// 2. Manipulasi Elemen DOM & Manajemen Antarmuka Terminal HUD
const chatOutput = document.getElementById('chat-output');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// MODIFIKASI: Menggunakan struktur pembungkus pesan kompleks bertema siber
function appendMessage(text, isUser = false) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-wrapper', isUser ? 'user-wrapper' : 'bot-wrapper');

  // Cetakan template HTML berdasarkan identitas pengirim
  wrapper.innerHTML = isUser ? `
    <div class="chat-avatar user-avatar">
      <i class="fas fa-user-astronaut fallback-icon"></i>
    </div>
    <div class="message user-msg">
      <span class="msg-sender">USER // GUEST</span>
      ${escapeHTML(text)}
    </div>
  ` : `
    <div class="chat-avatar">
      <img src="assets/avatar.jpg" alt="AI Twin" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <i class="fas fa-robot fallback-icon" style="display: none;"></i>
    </div>
    <div class="message bot-msg">
      <span class="msg-sender">SYS // FADIL_AI</span>
      ${text}
    </div>
  `;

  chatOutput.appendChild(wrapper);
  chatOutput.scrollTop = chatOutput.scrollHeight;
  return wrapper;
}

// MODIFIKASI: Menyelaraskan indikator mengetik dengan struktur avatar bot baru
function createTypingIndicator() {
  const indicatorWrapper = document.createElement('div');
  indicatorWrapper.classList.add('message-wrapper', 'bot-wrapper');
  indicatorWrapper.id = 'temp-typing';

  indicatorWrapper.innerHTML = `
    <div class="chat-avatar">
      <img src="assets/avatar.jpg" alt="AI Twin" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <i class="fas fa-robot fallback-icon" style="display: none;"></i>
    </div>
    <div class="message bot-msg">
      <span class="msg-sender">SYS // NEURAL_PROCESSING</span>
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  
  chatOutput.appendChild(indicatorWrapper);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('temp-typing');
  if (indicator) indicator.remove();
}

// Helper untuk mencegah serangan XSS dari input mentah pengguna
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// 3. Transaksi Data Post Request ke Server Edge Groq Cloud
async function fetchGroqAIResponse(userMessageText) {
  if (GROQ_CONFIG.API_KEY === "MASUKKAN_API_KEY_GROQ_ANDA_DI_SINI" || !GROQ_CONFIG.API_KEY) {
    removeTypingIndicator();
    appendMessage("Sistem Error: Kunci Enkripsi Groq API Key belum dikonfigurasi di dalam berkas 'assets/js/chatbot.js'. Sila baca panduan README untuk mengaktifkan fitur.");
    return;
  }

  try {
    const payload = {
      model: GROQ_CONFIG.MODEL,
      messages: [
        { role: "system", content: personalKnowledgePrompt },
        { role: "user", content: userMessageText }
      ],
      temperature: 0.6,
      max_tokens: 1024
    };

    const response = await fetch(GROQ_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_CONFIG.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Koneksi gateway API gagal.");
    }

    const jsonResult = await response.json();
    // Mengganti baris pemisah karakter newline (\n) menjadi tag break baris HTML agar rapi di terminal
    const aiCleanReply = jsonResult.choices[0].message.content.replace(/\n/g, "<br>");
    
    removeTypingIndicator();
    appendMessage(aiCleanReply);
  } catch (err) {
    console.error("Chat Subsystem Error:", err);
    removeTypingIndicator();
    appendMessage(`Maaf, terjadi gangguan pada transmisi neural jaringan: ${err.message}`);
  }
}

// 4. Form Submission Listener
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const rawText = userInput.value.trim();
  if (!rawText) return;

  appendMessage(rawText, true);
  userInput.value = '';

  createTypingIndicator();
  fetchGroqAIResponse(rawText);
});

// Inisialisasi awal saat halaman diakses
loadPersonalKnowledgeBase();