window.addEventListener('load', () => {
  const preloader = document.getElementById('cyber-preloader');
  if (preloader) {
    setTimeout(() => { preloader.classList.add('loaded'); }, 500);
  }
});

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

if (terminalBody) {
  setTimeout(typeLogStream, 1200);
}

function triggerCyberAlert(title, message, isSuccess = true) {
  const modal = document.getElementById('cyberAlertModal');
  const box = document.getElementById('cyberAlertBox');
  const titleEl = document.getElementById('cyberAlertTitle');
  const messageEl = document.getElementById('cyberAlertMessage');
  const btnEl = document.getElementById('cyberAlertBtn');

  if (!modal || !box || !titleEl || !messageEl || !btnEl) return;

  titleEl.textContent = `> ${title}`;
  messageEl.textContent = message;

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

window.addEventListener('click', (e) => {
  const modal = document.getElementById('cyberAlertModal');
  if (e.target === modal) {
    closeCyberAlert();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const bugForm = document.querySelector('form[name="anonymous-bug-reports"]');
  const submitBtn = document.querySelector('.btn-submit');
  const textarea = document.querySelector('.form-textarea');

  if (bugForm && submitBtn && textarea) {
    
    const handleInputVerification = () => {
      if (textarea.value.trim().length > 0) {
        submitBtn.classList.add('visible');
      } else {
        submitBtn.classList.remove('visible');
      }
    };

    textarea.addEventListener('input', handleInputVerification);
    textarea.addEventListener('paste', () => { setTimeout(handleInputVerification, 10); });

    bugForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(bugForm);
      formData.append("access_key", "eba50088-52db-40eb-b0d4-67fcb2cba479");

      const originalBtnText = submitBtn.textContent;
      
      submitBtn.textContent = "TRANSMITTING_LOG...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          triggerCyberAlert(
            "SYS // LOG_TRANSMITTED_SUCCESSFULLY", 
            "Anomaly packet has been securely injected and recorded into the database.", 
            true
          );
          
          bugForm.reset();
          submitBtn.classList.remove('visible');
        } else {
          throw new Error(data.message || "Uplink node actively rejected the data packet.");
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