// Intersection Observer for Scroll Animations
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Hanya animasikan sekali
        }
    });
}, {
    threshold: 0.15, // Elemen terpicu jika muncul 15% di layar
    rootMargin: "0px 0px -5px 0px"
});

revealElements.forEach(element => {
    // Tambahkan class css initial state via js
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    
    revealOnScroll.observe(element);
});

// Inject rule tambahan untuk trigger class visible ke document style
const style = document.createElement('style');
style.innerHTML = `
  .reveal.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);