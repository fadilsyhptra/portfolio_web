const GROQ_CONFIG = {
  ENDPOINT: "/.netlify/functions/groq-chat",
  MODEL: "openai/gpt-oss-120b"
};

let personalKnowledgePrompt = "";
let chatHistory = [];

async function loadPersonalKnowledgeBase() {
  try {
    const response = await fetch('./assets/data/personal_data.json');
    if (!response.ok) throw new Error('Gagal mengakses data repositori lokal.');
    
    const data = await response.json();
    
    personalKnowledgePrompt = `
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

      LARANGAN MUTLAK (ANTI-MET COGNITION ERROR):
      - JANGAN PERNAH menuliskan proses berpikir, analisis aturan, monolog batin, atau teks evaluasi seperti "Okay, the user said...", "I need to respond appropriately...", atau "Let me check the guidelines" di dalam chat!
      - Teks balasan Anda harus LANGSUNG berisi jawaban akhir sebagai FADIL_AI tanpa embel-embel coretan internal apa pun di awalnya.
    `;
    console.log("Knowledge Base System injected successfully.");
  } catch (error) {
    console.error("Critical AI Base Error:", error);
    personalKnowledgePrompt = "Anda adalah asisten AI dari Muhammad Fadil Syahputra, namun gagal memuat data biografi lengkap secara dinamis.";
  }
}

const chatOutput = document.getElementById('chat-output');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input'); 
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, isUser = false) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-wrapper', isUser ? 'user-wrapper' : 'bot-wrapper');

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

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

async function fetchGroqAIResponse(userMessageText) {
  try {
    chatHistory.push({ role: "user", content: userMessageText });

    const payload = {
      model: GROQ_CONFIG.MODEL,
      messages: [
        { role: "system", content: personalKnowledgePrompt },
        ...chatHistory
      ],
      temperature: 0.8,
      max_tokens: 1024
    };

    const response = await fetch(GROQ_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const jsonResult = await response.json();

    if (!response.ok) {
      throw new Error(jsonResult.error || "Koneksi gateway API gagal.");
    }

    let aiRawReply = jsonResult.choices[0].message.content;
    aiRawReply = aiRawReply.replace(/<think>[\s\S]*?<\/think>/g, "");
    if (aiRawReply.toLowerCase().includes("the user said") || aiRawReply.toLowerCase().includes("guidelines")) {
      const splitReply = aiRawReply.split(/\n\s*\n/);
      if (splitReply.length > 1) {
        aiRawReply = splitReply.slice(1).join("\n\n");
      }
    }

    aiRawReply = aiRawReply.trim();
    chatHistory.push({ role: "assistant", content: aiRawReply });

    const aiCleanReply = aiRawReply.replace(/\n/g, "<br>");
    
    removeTypingIndicator();
    appendMessage(aiCleanReply);
  } catch (err) {
    console.error("Chat Subsystem Error:", err);
    removeTypingIndicator();
    appendMessage(`Maaf, terjadi gangguan pada transmisi neural jaringan: ${err.message}`);
  }
}

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawText = userInput.value.trim();
    if (!rawText) return;

    appendMessage(rawText, true);
    userInput.value = '';
    
    checkInputEcho(); 

    createTypingIndicator();
    fetchGroqAIResponse(rawText);
  });
}

loadPersonalKnowledgeBase();

function toggleMobileMenu() {
  const dropdown = document.getElementById("mobileDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show-menu");
  }
}

const bugAlertOverlay = document.getElementById('bug-alert-overlay');
const alertCancelBtn = document.getElementById('alert-cancel-btn');
const alertConfirmBtn = document.getElementById('alert-confirm-btn');

function launchBugAlert(targetUrl) {
  if (bugAlertOverlay) {
    bugAlertOverlay.classList.add('active');
    
    alertConfirmBtn.onclick = function() {
      bugAlertOverlay.classList.remove('active');
      window.location.href = targetUrl;
    };
  }
}

if (alertCancelBtn) {
  alertCancelBtn.addEventListener('click', () => {
    bugAlertOverlay.classList.remove('active');
  });
}

document.addEventListener('click', function(e) {
  const reportTarget = e.target.closest('.red-report, .desktop-report-fab');
  
  if (reportTarget) {
    e.preventDefault(); 
    
    const dropdown = document.getElementById("mobileDropdown");
    if (dropdown) dropdown.classList.remove("show-menu");
    
    const targetUrl = reportTarget.getAttribute('href') || 'report-bug.html';
    launchBugAlert(targetUrl);
  }
});

window.addEventListener('click', function(event) {
  const dropdown = document.getElementById("mobileDropdown");
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  
  if (dropdown && dropdown.classList.contains('show-menu')) {
    if (toggleBtn && !toggleBtn.contains(event.target)) {
      dropdown.classList.remove('show-menu');
    }
  }
});

window.addEventListener('load', () => {
  const cyberLoader = document.getElementById('cyber-loader');
  
  if (cyberLoader) {
    setTimeout(() => {
      cyberLoader.classList.add('fade-out');
    }, 500);
  }
});

function checkInputEcho() {
  if (userInput && sendBtn) {
    if (userInput.value.trim() === "") {
      sendBtn.classList.add('transmit-hidden');
    } else {
      sendBtn.classList.remove('transmit-hidden');
    }
  }
}

if (userInput) {
  userInput.addEventListener('input', checkInputEcho);
}

checkInputEcho();