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
    }, 4000);
    return;
  }

  const currentLine = logData[lineIndex];
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'terminal-cursor';
  cursorSpan.textContent = '_';

  if (!terminalBody.querySelector('.current-line-stream')) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'current-line-stream';
    terminalBody.appendChild(lineDiv);
  }

  const activeLineContainer = terminalBody.querySelector('.current-line-stream');

  if (charIndex < currentLine.length) {
    activeLineContainer.textContent = currentLine.substring(0, charIndex + 1);
    activeLineContainer.appendChild(cursorSpan);
    charIndex++;
    setTimeout(typeLogStream, 25);
  } else {
    activeLineContainer.textContent = currentLine;
    activeLineContainer.classList.remove('current-line-stream');
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLogStream, 350);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (terminalBody) {
    typeLogStream();
  }
});

function triggerCyberAlert(title, message, isSuccess = false) {
  const modal = document.getElementById("cyberAlertModal");
  const box = document.getElementById("cyberAlertBox");
  const titleEl = document.getElementById("cyberAlertTitle");
  const msgEl = document.getElementById("cyberAlertMessage");
  const btnEl = document.getElementById("cyberAlertBtn");

  if (!modal || !box || !titleEl || !msgEl || !btnEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  box.classList.remove("alert-success", "alert-failure");
  btnEl.classList.remove("btn-alert-success", "btn-alert-failure");

  if (isSuccess) {
    box.classList.add("alert-success");
    btnEl.classList.add("btn-alert-success");
  } else {
    box.classList.add("alert-failure");
    btnEl.classList.add("btn-alert-failure");
  }

  modal.classList.add("visible");
}

function closeCyberAlert() {
  const modal = document.getElementById("cyberAlertModal");
  if (modal) {
    modal.classList.remove("visible");
  }
}

let isCaptchaVerified = false;

function onCaptchaSuccess(token) {
  isCaptchaVerified = true;
  if (typeof window.handleInputVerification === "function") {
    window.handleInputVerification();
  }
}

function onCaptchaExpired() {
  isCaptchaVerified = false;
  if (typeof window.handleInputVerification === "function") {
    window.handleInputVerification();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const bugForm = document.forms["anonymous-bug-reports"];
  if (bugForm) {
    const bugDescription = bugForm.elements["bug_description"];
    const submitBtn = bugForm.querySelector(".btn-submit");

    function handleInputVerification() {
      if (bugDescription.value.trim() !== "" && isCaptchaVerified) {
        submitBtn.classList.add("visible");
      } else {
        submitBtn.classList.remove("visible");
      }
    }

    bugDescription.addEventListener("input", handleInputVerification);
    bugDescription.addEventListener("change", handleInputVerification);
    bugForm.addEventListener("paste", () => { setTimeout(handleInputVerification, 10); });

    window.onCaptchaSuccess = onCaptchaSuccess;
    window.onCaptchaExpired = onCaptchaExpired;
    window.handleInputVerification = handleInputVerification;

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
          isCaptchaVerified = false;
          if (typeof hcaptcha !== "undefined") {
            hcaptcha.reset();
          }
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