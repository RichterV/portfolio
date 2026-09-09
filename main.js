// Carregamento das sections
const sections = [
  { id: "navigation", file: "navigation.html" },
  { id: "include-hero", file: "hero.html" },
  { id: "about", file: "about.html" },
  { id: "education", file: "education.html" },
  { id: "projects-container", file: "projects.html" },
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

// Carrossel genérico (usado por projetos e pesquisa): mantém a grade de
// 3 colunas x 2 linhas, e só ativa o carrossel se houver mais itens que cabem
// em uma página
function initCarousel({ sectionId, viewportId, trackId, prevId, nextId, dotsWrapperId, dotsId }) {
  const viewport = document.getElementById(viewportId);
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsWrapper = document.getElementById(dotsWrapperId);
  const dotsContainer = document.getElementById(dotsId);
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
    pageDiv.className = 'grid content-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full flex-shrink-0 px-2';
    group.forEach(card => pageDiv.appendChild(card));
    track.appendChild(pageDiv);
  });

  dotsContainer.innerHTML = '';
  pageGroups.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'w-6 h-1.5 rounded-sm bg-term-border transition-colors duration-300';
    dot.setAttribute('aria-label', `${idx + 1}`);
    dot.addEventListener('click', () => goToPage(idx));
    dotsContainer.appendChild(dot);
  });

  let currentPage = 0;
  let autoplayTimer = null;
  let scrollIdleTimer = null;
  let sectionInView = false;
  const AUTOPLAY_DELAY = 4000;
  const SCROLL_IDLE_DELAY = 700;

  function updateUI() {
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    Array.from(dotsContainer.children).forEach((dot, idx) => {
      dot.classList.toggle('bg-term-green', idx === currentPage);
      dot.classList.toggle('bg-term-border', idx !== currentPage);
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

  function cancelScheduledAutoplay() {
    if (scrollIdleTimer) {
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = null;
    }
  }

  function scheduleAutoplayStart() {
    cancelScheduledAutoplay();
    scrollIdleTimer = setTimeout(() => {
      if (sectionInView) startAutoplay();
    }, SCROLL_IDLE_DELAY);
  }

  function resetToFirstPage() {
    stopAutoplay();
    cancelScheduledAutoplay();
    currentPage = 0;
    updateUI();
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  // Arrastar (swipe) no mobile faz o mesmo que os botões prev/next.
  if (viewport) {
    const SWIPE_THRESHOLD = 40;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let touchDeltaY = 0;

    viewport.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchDeltaX = 0;
      touchDeltaY = 0;
      stopAutoplay();
      cancelScheduledAutoplay();
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      touchDeltaX = touch.clientX - touchStartX;
      touchDeltaY = touch.clientY - touchStartY;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > SWIPE_THRESHOLD && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
        goToPage(touchDeltaX < 0 ? currentPage + 1 : currentPage - 1);
      }
      if (sectionInView) scheduleAutoplayStart();
    });
  }

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

  // Em telas touch não existe hover, então as setas nunca apareceriam -
  // nesse caso deixamos elas sempre visíveis.
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  const carouselSection = document.getElementById(sectionId);
  if (carouselSection) {
    if (supportsHover) {
      carouselSection.addEventListener('mouseenter', showArrows);
      carouselSection.addEventListener('mouseleave', hideArrows);
    } else {
      showArrows();
    }
  }

  prevBtn.classList.remove('hidden');
  prevBtn.classList.add('flex');
  nextBtn.classList.remove('hidden');
  nextBtn.classList.add('flex');
  dotsWrapper.classList.remove('hidden');
  dotsWrapper.classList.add('flex');

  updateUI();

  // Só inicia o autoplay quando o usuário parar de rolar dentro da seção,
  // e sempre volta para a primeira página ao entrar/sair dela. Assim, ao
  // rolar rapidamente até a seção, o usuário sempre vê os itens da primeira
  // página em vez de cair em uma página intermediária.
  if (carouselSection) {
    // Só reseta a página ao cruzar a fronteira de entrar/sair da seção
    // (evita resets redundantes se o observer disparar mais de uma vez
    // seguida com o mesmo estado).
    let wasInView = false;
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionInView = true;
          if (!wasInView) resetToFirstPage();
          wasInView = true;
          scheduleAutoplayStart();
        } else {
          sectionInView = false;
          if (wasInView) resetToFirstPage();
          wasInView = false;
        }
      });
    }, { threshold: 0.4 });

    sectionObserver.observe(carouselSection);

    window.addEventListener('scroll', () => {
      if (sectionInView) scheduleAutoplayStart();
    }, { passive: true });
  }
}

// Inicialização principal
loadSectionsAndInit(() => {
  initCarousel({
    sectionId: 'projects',
    viewportId: 'projects-viewport',
    trackId: 'projects-track',
    prevId: 'projects-prev',
    nextId: 'projects-next',
    dotsWrapperId: 'projects-dots-wrapper',
    dotsId: 'projects-dots',
  });
  initCarousel({
    sectionId: 'research',
    viewportId: 'research-viewport',
    trackId: 'research-track',
    prevId: 'research-prev',
    nextId: 'research-next',
    dotsWrapperId: 'research-dots-wrapper',
    dotsId: 'research-dots',
  });

  // ScrollReveal
  const scrollReveal = ScrollReveal({
    origin: 'top',
    distance: '18px',
    duration: 550,
    reset: true
  });

  scrollReveal.reveal(`
    #about h2, #about .term-window, #about .space-y-6, #about .flex-wrap,
    #education h2, #education .term-window,
    #projects h2, #projects pre, #projects .card-hover,
    #research h2, #research .card-hover,
    #technologies h2, #technologies .term-window,
    #contact h2, #contact .term-window
  `, { interval: 60 });

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
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }

  backToTop();
  activateMenuAtCurrentSection();
});
