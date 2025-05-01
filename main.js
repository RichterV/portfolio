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

// Inicialização principal
loadSectionsAndInit(() => {
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
