const GROQ_CONFIG = {
  ENDPOINT: "/api/groq-chat",
  MODEL: "meta-llama/llama-4-scout-17b-16e-instruct"
};

let chatHistory = [];
let isTyping = false;

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
  isTyping = true;

  if (sendBtn) {
    sendBtn.classList.add('transmit-hidden');
    sendBtn.disabled = true;
    sendBtn.style.pointerEvents = 'none'; 
  }

  if (userInput) {
    userInput.disabled = true;
    userInput.readOnly = true;
  }

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

  if (indicator) {
    indicator.remove();
  }

  isTyping = false;

  if (sendBtn) {
    sendBtn.disabled = false;
    sendBtn.style.pointerEvents = 'auto';
  }

  if (userInput) {
    userInput.disabled = false;
    userInput.readOnly = false;
    userInput.focus(); 
  }

  checkInputEcho();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

async function fetchGroqAIResponse(userMessageText) {
  try {
    chatHistory.push({
      role: "user",
      content: userMessageText
    });

    const payload = {
      chatHistory: chatHistory
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

    if (
      aiRawReply.toLowerCase().includes("the user said") ||
      aiRawReply.toLowerCase().includes("guidelines")
    ) {
      const splitReply = aiRawReply.split(/\n\s*\n/);

      if (splitReply.length > 1) {
        aiRawReply = splitReply.slice(1).join("\n\n");
      }
    }

    aiRawReply = aiRawReply.trim();

    chatHistory.push({
      role: "assistant",
      content: aiRawReply
    });

    const aiCleanReply = aiRawReply.replace(/\n/g, "<br>");

    removeTypingIndicator();
    appendMessage(aiCleanReply);
  } catch (err) {
    console.error("Chat Subsystem Error:", err);

    removeTypingIndicator();

    appendMessage(
      `Oops! Fadil-AI has reached the daily usage limit for today. Please come back and try again later. 😊`
    );
  }
}

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isTyping) {
      e.stopImmediatePropagation();
      return false;
    }

    const rawText = userInput.value.trim();
    if (!rawText) return;

    isTyping = true; 
    userInput.blur(); 
    
    userInput.disabled = true;
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.pointerEvents = 'none';
    }

    appendMessage(rawText, true);
    userInput.value = '';

    checkInputEcho();
    createTypingIndicator();
    fetchGroqAIResponse(rawText);
  });
}

if (userInput) {
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (isTyping) {
        e.preventDefault(); 
        e.stopPropagation(); 
        return false;
      }
    }
  });
  
  userInput.addEventListener('input', checkInputEcho);
}

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

    if (dropdown) {
      dropdown.classList.remove("show-menu");
    }

    const targetUrl = reportTarget.getAttribute('href') || 'report-bug.html';
    launchBugAlert(targetUrl);
  }
});

window.addEventListener('click', function(event) {
  const dropdown = document.getElementById("mobileDropdown");
  const toggleBtn = document.querySelector('.nav-toggle-btn');

  if (
    dropdown &&
    dropdown.classList.contains('show-menu')
  ) {
    if (
      toggleBtn &&
      !toggleBtn.contains(event.target)
    ) {
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
  if (!userInput || !sendBtn) return;

  const typingIndicator = document.getElementById('temp-typing');

  if (isTyping || typingIndicator) {
    sendBtn.classList.add('transmit-hidden');
    sendBtn.disabled = true;
    sendBtn.style.pointerEvents = 'none';
    return;
  }

  if (userInput.value.trim() === '') {
    sendBtn.classList.add('transmit-hidden');
    sendBtn.disabled = true;
    sendBtn.style.pointerEvents = 'none';
  } else {
    sendBtn.classList.remove('transmit-hidden');
    sendBtn.disabled = false;
    sendBtn.style.pointerEvents = 'auto';
  }
}

if (userInput) {
  userInput.addEventListener('input', checkInputEcho);
}

checkInputEcho();