document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. PRELOADER ENGINE
     ========================================================================== */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    });
  }

  /* ==========================================================================
     2. TACTICAL HAMBURGER & MOBILE MENU
     ========================================================================== */
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.nav-menu');
  const allLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && mobileMenu) {
    // Aksi klik tombol burger
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Otomatis tutup menu jika link diklik
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Otomatis tutup menu jika area luar diklik
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. ACTIVE LINK TRACKER ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150; 

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. SCROLL-DRIVEN ANIMATION ENGINE (REVEAL ON SCROLL)
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15 // Memicu animasi saat 15% elemen terlihat
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Animasi berjalan sekali saja
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    scrollObserver.observe(element);
  });

});