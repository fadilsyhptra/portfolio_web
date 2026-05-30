document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.querySelector('i').classList.toggle('fa-bars');
      menuToggle.querySelector('i').classList.toggle('fa-times');
    });
    
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
      });
    });
  }

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

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

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
});

// RESET SCRIPT NAVIGASI
const toggleBtn = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.nav-menu');
const allLinks = document.querySelectorAll('.nav-link');

if (toggleBtn && mobileMenu) {
  // Aksi Klik Tombol Burger
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah bentrokan event
    toggleBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Otomatis tutup jika link menu diklik
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Otomatis tutup jika pengguna mengklik area luar menu
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}