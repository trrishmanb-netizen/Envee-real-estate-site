// =========================
// ENVEE Real Estate Scripts
// =========================

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupAnimatedCounters();
  setupSmoothSectionReveal();
  setupFireworks();
  setupDummyForms();
});

// =========================
// Mobile Menu
// =========================
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        mainNav.classList.remove("open");
      }
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && window.innerWidth <= 860) {
      mainNav.classList.remove("open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      mainNav.classList.remove("open");
    }
  });
}

// =========================
// Animated Counters
// =========================
function setupAnimatedCounters() {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.getAttribute("data-target")) || 0;
        animateCounter(counter, target);
        obs.unobserve(counter);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 1600;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(eased * target);

    element.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(updateCounter);
}

// =========================
// Section Reveal on Scroll
// =========================
function setupSmoothSectionReveal() {
  const sections = document.querySelectorAll(
    ".service-card, .zone-card, .mini-card, .stat-card, .feature-box, .contact-card, .faq-item"
  );

  if (!sections.length) return;

  sections.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(24px)";
    item.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((item) => observer.observe(item));
}

// =========================
// Fireworks Background
// =========================
function setupFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let fireworks = [];
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Firework {
    constructor() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.targetX = 80 + Math.random() * (width - 160);
      this.targetY = 60 + Math.random() * (height * 0.45);
      this.speed = 2 + Math.random() * 2.2;
      this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      this.reached = false;
    }

    update() {
      if (this.reached) return;

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 12) {
        this.reached = true;
        explode(this.targetX, this.targetY);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, 0.95)";
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.012 + Math.random() * 0.02;
      this.radius = 1 + Math.random() * 2.2;

      const palette = [
        "212,175,55",   // gold
        "255,215,120",  // light gold
        "255,255,255",  // white
        "173,216,230"   // pale blue
      ];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.015;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(this.alpha, 0)})`;
      ctx.fill();
    }
  }

  function explode(x, y) {
    const count = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  }

  function maybeLaunchFirework() {
    // Keep it subtle
    if (Math.random() < 0.03) {
      fireworks.push(new Firework());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    maybeLaunchFirework();

    fireworks.forEach((firework) => {
      firework.update();
      firework.draw();
    });

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    fireworks = fireworks.filter((firework) => !firework.reached);
    particles = particles.filter((particle) => particle.alpha > 0);

    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);

  // Clean fallback if page unloads
  window.addEventListener("beforeunload", () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}

// =========================
// Dummy Form Handler
// =========================
function setupDummyForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = "Submitted";
        submitButton.disabled = true;

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          form.reset();
        }, 1800);
      } else {
        form.reset();
      }

      alert("Thank you. Your inquiry has been received.");
    });
  });
}
