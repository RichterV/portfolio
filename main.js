
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

sections.forEach(section => {
    fetch(section.file)
        .then(res => res.text())
        .then(html => {
            document.getElementById(section.id).innerHTML = html;
        })
        .catch(err => console.error(`Failed to load ${section.file}:`, err));
});

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
  
  // ScrollReveal só roda depois que todas as seções foram inseridas
  loadSectionsAndInit(() => {
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
  });

// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Smooth scrolling for all links
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

// Add shadow to navbar on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 10) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

 // envio de email
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const form = e.target;
    const data = new FormData(form);
    const toast = document.getElementById('toast');

    fetch('https://formspree.io/f/xovdjrra', {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Limpa os campos do formulário
            form.reset();

            // Mostra o toast
            toast.classList.remove('hidden');
            toast.classList.add('opacity-0');

            // Transição suave
            setTimeout(() => {
                toast.classList.remove('opacity-0');
            }, 100);

            // Esconde o toast após 4 segundos
            setTimeout(() => {
                toast.classList.add('opacity-0');
            }, 4000);

            // Remove completamente após a transição
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4500);
        } else {
            alert('Erro ao enviar mensagem. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar mensagem. Tente novamente.');
    });
});
