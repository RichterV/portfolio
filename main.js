// Carregamento das sections
const sections = [
  { id: "navigation", file: "navigation.html" },
  { id: "include-hero", file: "hero.html" },
  { id: "about", file: "about.html" },
  { id: "education", file: "education.html" },
  { id: "projects", file: "projects.html" },
  { id: "research", file: "research.html" },
  { id: "technologies", file: "technologies.html" },
  { id: "contact", file: "contact.html" },
  { id: "footer", file: "footer.html" },
];

// Variável global para o botão voltar ao topo
let backToTopButton = null;

// Função para mostrar/ocultar botão
function backToTop() {
  if (backToTopButton) {
    if (window.scrollY >= 560) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
}

// Scrollspy: ativa o menu conforme seção visível
function activateMenuAtCurrentSection() {
  const checkpoint = window.pageYOffset + (window.innerHeight / 2);
  const sectionsToWatch = document.querySelectorAll('main section[id], div[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  sectionsToWatch.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    const start = checkpoint >= sectionTop;
    const end = checkpoint <= sectionTop + sectionHeight;

    const link = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (link) {
      if (start && end) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// Função para carregar os HTMLs e iniciar
function loadSectionsAndInit(callback) {
  const promises = sections.map(section =>
    fetch(section.file)
      .then(res => res.text())
      .then(html => {
        document.getElementById(section.id).innerHTML = html;
      })
  );

  Promise.all(promises).then(() => {
    backToTopButton = document.querySelector('.back-to-top');
    callback();
  });
}

// Carrossel de projetos: mantém a grade de 3 colunas x 2 linhas,
// e só ativa o carrossel se houver mais de 6 projetos
function initProjectsCarousel() {
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  const dotsWrapper = document.getElementById('projects-dots-wrapper');
  const dotsContainer = document.getElementById('projects-dots');
  if (!track || !prevBtn || !nextBtn || !dotsWrapper || !dotsContainer) return;

  const firstPage = track.firstElementChild;
  if (!firstPage) return;

  const cards = Array.from(firstPage.children);
  const perPage = 6;
  if (cards.length <= perPage) return;

  const pageGroups = [];
  for (let i = 0; i < cards.length; i += perPage) {
    pageGroups.push(cards.slice(i, i + perPage));
  }

  track.innerHTML = '';
  pageGroups.forEach(group => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'grid content-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full flex-shrink-0 px-2';
    group.forEach(card => pageDiv.appendChild(card));
    track.appendChild(pageDiv);
  });

  dotsContainer.innerHTML = '';
  pageGroups.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 transition-colors';
    dot.setAttribute('aria-label', `${idx + 1}`);
    dot.addEventListener('click', () => goToPage(idx));
    dotsContainer.appendChild(dot);
  });

  let currentPage = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 4000;

  function updateUI() {
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    Array.from(dotsContainer.children).forEach((dot, idx) => {
      dot.classList.toggle('bg-green-600', idx === currentPage);
      dot.classList.toggle('bg-gray-300', idx !== currentPage);
    });
  }

  function goToPage(idx) {
    currentPage = (idx + pageGroups.length) % pageGroups.length;
    updateUI();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToPage(currentPage + 1), AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  track.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', stopAutoplay);
    card.addEventListener('mouseleave', startAutoplay);
  });

  function showArrows() {
    [prevBtn, nextBtn].forEach(btn => {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100', 'pointer-events-auto');
    });
  }

  function hideArrows() {
    [prevBtn, nextBtn].forEach(btn => {
      btn.classList.add('opacity-0', 'pointer-events-none');
      btn.classList.remove('opacity-100', 'pointer-events-auto');
    });
  }

  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.addEventListener('mouseenter', showArrows);
    projectsSection.addEventListener('mouseleave', hideArrows);
  }

  prevBtn.classList.remove('hidden');
  prevBtn.classList.add('flex');
  nextBtn.classList.remove('hidden');
  nextBtn.classList.add('flex');
  dotsWrapper.classList.remove('hidden');
  dotsWrapper.classList.add('flex');

  updateUI();
  startAutoplay();
}

// Inicialização principal
loadSectionsAndInit(() => {
  initProjectsCarousel();

  // ScrollReveal
  const scrollReveal = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 700,
    reset: true
  });

  scrollReveal.reveal(`
    #home h1, #home h2, #home p, #home a,
    #about .image, #about h2, #about h3, #about p, #about span,
    #education h2, #education .flex,
    #projects h2, #projects .card-hover,
    #research h2, #research .card-hover,
    .tech-icon,
    #contact h2, #contact form, #contact .bg-white
  `, { interval: 100 });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Formulário de contato
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const form = e.target;
      const data = new FormData(form);

      fetch('https://formspree.io/f/xovdjrra', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            form.reset();

            if (toast) {
              toast.classList.remove('hidden');
              toast.classList.add('opacity-0');

              setTimeout(() => {
                toast.classList.remove('opacity-0');
              }, 100);

              setTimeout(() => {
                toast.classList.add('opacity-0');
              }, 4000);

              setTimeout(() => {
                toast.classList.add('hidden');
              }, 4500);
            }
          } else {
            alert('Erro ao enviar mensagem. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao enviar mensagem. Tente novamente.');
        });
    });
  }
});

// Smooth scroll para links de âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Scroll listener geral
window.addEventListener('scroll', function () {
  const nav = document.querySelector('nav');
  if (window.scrollY > 10) {
    nav.classList.add('shadow-lg');
  } else {
    nav.classList.remove('shadow-lg');
  }

  backToTop();
  activateMenuAtCurrentSection();
});
