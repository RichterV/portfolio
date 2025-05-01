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
  
  // Função para carregar todos os HTMLs e executar callback depois
  function loadSectionsAndInit(callback) {
    const promises = sections.map(section =>
      fetch(section.file)
        .then(res => res.text())
        .then(html => {
          document.getElementById(section.id).innerHTML = html;
        })
    );
  
    Promise.all(promises).then(callback);
  }
  
  // Executa após todas as seções estarem carregadas
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
  
      // Fecha o menu mobile ao clicar em um link
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
          mobileMenu.classList.add('hidden');
        });
      });
    }
  
    // Envio de formulário de contato
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
  
  // Smooth scrolling para todos os links âncora
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
  
  // Adiciona sombra ao navbar ao rolar
  window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (window.scrollY > 10) {
      nav.classList.add('shadow-lg');
    } else {
      nav.classList.remove('shadow-lg');
    }
  });
  