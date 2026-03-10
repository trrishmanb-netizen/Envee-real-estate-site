document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Counter animation
  const counters = document.querySelectorAll(".counter");
  const animatedCounters = new WeakSet();

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animatedCounters.has(entry.target)) return;

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const duration = 1600;
        const startTime = performance.now();

        animatedCounters.add(el);

        const formatValue = (value, finalTarget) => {
          if (finalTarget >= 1000) return `${Math.floor(value)}+`;
          if (finalTarget === 1) return "1B+";
          if (finalTarget >= 100) return `${Math.floor(value)}+`;
          return `${Math.floor(value)}+`;
        };

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = target * eased;

          el.textContent = formatValue(currentValue, target);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = formatValue(target, target);
          }
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.4,
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // FAQ accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Subtle fireworks / sparkle particles in hero
  const heroFireworks = document.getElementById("heroFireworks");

  if (heroFireworks) {
    const particleCount = 14;

    for (let i = 0; i < particleCount; i++) {
      const spark = document.createElement("span");
      spark.className = "firework";

      const top = Math.random() * 70 + 5;
      const left = Math.random() * 90 + 3;
      const delay = Math.random() * 4.5;
      const duration = 3.5 + Math.random() * 2.5;

      spark.style.top = `${top}%`;
      spark.style.left = `${left}%`;
      spark.style.animationDelay = `${delay}s`;
      spark.style.animationDuration = `${duration}s`;

      heroFireworks.appendChild(spark);
    }
  }

  // Smooth anchor offset improvement for sticky header
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // Simple contact form demo behavior
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting ENVEE Real Estate. We will get back to you soon.");
      contactForm.reset();
    });
  }
});