// ==========================================================================
// 1. CYBER PRELOADER CLOSER
// ==========================================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('cyber-preloader');
  if (preloader) {
    setTimeout(() => { preloader.classList.add('loaded'); }, 500);
  }
});

// ==========================================================================
// 2. MOBILE DROPDOWN MENU CONTROLLER
// ==========================================================================
function toggleMobileMenu() {
  const dropdown = document.getElementById('mobileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show-menu');
  }
}

window.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-menu-wrapper')) {
    const dropdown = document.getElementById('mobileDropdown');
    if (dropdown && dropdown.classList.contains('show-menu')) {
      dropdown.classList.remove('show-menu');
    }
  }
});

// ==========================================================================
// 3. REALISTIC TERMINAL STREAM ANIMATION
// ==========================================================================
const logData = [
  "Connecting to core node 0x7FFF8C...",
  "Fetching portfolio index data structures...",
  "Syncing dynamic AI twin telemetry matrix...",
  "Flushing buffer console and reloading feed...\n"
];

const terminalBody = document.getElementById('terminalConsole');
let lineIndex = 0;
let charIndex = 0;

function typeLogStream() {
  if (lineIndex >= logData.length) {
    setTimeout(() => {
      if (terminalBody) terminalBody.innerHTML = '<span class="terminal-cursor">_</span>';
      lineIndex = 0;
      charIndex = 0;
      typeLogStream();
    }, 2500);
    return;
  }

  if (charIndex === 0 && terminalBody) {
    const p = document.createElement('p');
    p.className = 'console-log-line';
    p.innerHTML = '<span class="prompt-prefix">> </span><span class="text-content"></span>';
    terminalBody.insertBefore(p, terminalBody.lastElementChild);
  }

  const activeLines = terminalBody ? terminalBody.getElementsByClassName('console-log-line') : [];
  if (activeLines.length > 0) {
    const currentActiveLine = activeLines[activeLines.length - 1].querySelector('.text-content');
    const fullTextToType = logData[lineIndex];

    if (charIndex < fullTextToType.length) {
      if (currentActiveLine) currentActiveLine.textContent += fullTextToType.charAt(charIndex);
      charIndex++;
      setTimeout(typeLogStream, 30 + Math.random() * 40);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLogStream, 400);
    }
  }

  if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Inisialisasi terminal jika elemennya eksis di halaman
if (terminalBody) {
  setTimeout(typeLogStream, 1200);
}

// ==========================================================================
// 4. CUSTOM CYBER ALERT SYSTEM FUNCTIONS
// ==========================================================================
function triggerCyberAlert(title, message, isSuccess = true) {
  const modal = document.getElementById('cyberAlertModal');
  const box = document.getElementById('cyberAlertBox');
  const titleEl = document.getElementById('cyberAlertTitle');
  const messageEl = document.getElementById('cyberAlertMessage');
  const btnEl = document.getElementById('cyberAlertBtn');

  if (!modal || !box || !titleEl || !messageEl || !btnEl) return;

  titleEl.textContent = `> ${title}`;
  messageEl.textContent = message;

  // Reset class status
  box.classList.remove('alert-success', 'alert-error');
  btnEl.classList.remove('btn-alert-success', 'btn-alert-error');

  if (isSuccess) {
    box.classList.add('alert-success');
    btnEl.classList.add('btn-alert-success');
  } else {
    box.classList.add('alert-error');
    btnEl.classList.add('btn-alert-error');
  }

  modal.classList.add('active');
}

function closeCyberAlert() {
  const modal = document.getElementById('cyberAlertModal');
  if (modal) modal.classList.remove('active');
}

// Menutup modal jika user asal klik di area background luar kotak alert
window.addEventListener('click', (e) => {
  const modal = document.getElementById('cyberAlertModal');
  if (e.target === modal) {
    closeCyberAlert();
  }
});

// ==========================================================================
// 5. NETLIFY FORMS AJAX INTERCEPTION WITH LIVE INPUT DETECTION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const bugForm = document.querySelector('form[name="anonymous-bug-reports"]');
  const submitBtn = document.querySelector('.btn-submit');
  const textarea = document.querySelector('.form-textarea');

  if (bugForm && submitBtn && textarea) {
    
    // Fungsi validasi mendeteksi input real-time
    const handleInputVerification = () => {
      // .trim() memastikan spasi kosong massal diabaikan
      if (textarea.value.trim().length > 0) {
        submitBtn.classList.add('visible');
      } else {
        submitBtn.classList.remove('visible');
      }
    };

    // Pasang listener taktis saat user mengetik
    textarea.addEventListener('input', handleInputVerification);

    // Antisipasi jika user melakukan paste teks menggunakan mouse
    textarea.addEventListener('paste', () => {
      setTimeout(handleInputVerification, 10);
    });

    // Proses pengiriman Form
    bugForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(bugForm);
      const originalBtnText = submitBtn.textContent;
      
      submitBtn.textContent = "TRANSMITTING_LOG...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
          triggerCyberAlert(
            "SYS // LOG_TRANSMITTED_SUCCESSFULLY", 
            "Anomaly packet has been securely injected and recorded into the database.", 
            true
          );
          
          // Reset form dan sembunyikan kembali tombolnya
          bugForm.reset();
          submitBtn.classList.remove('visible');
        } else {
          throw new Error("Uplink node actively rejected the data packet.");
        }
      } catch (error) {
        triggerCyberAlert(
          "SYS // TRANSMISSION_FAILED", 
          `Uplink Error: ${error.message}. Please check your secure connection parameters.`, 
          false
        );
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }
});