
let menu;
let overlay;
let toggleButton;

document.addEventListener("DOMContentLoaded", () => {
  menu = document.getElementById("mobileMenu");
  overlay = document.getElementById("mobileOverlay");
  toggleButton = document.querySelector(".menu-toggle");

  initReveal();
  mountMobileActionBar();
  setMenuState(false);

  if (menu) {
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMobileMenu();
  });
});

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("show"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.12 });

  nodes.forEach((node) => io.observe(node));
}

function mountMobileActionBar() {
  if (document.querySelector(".mobile-cta-bar")) return;

  const whatsappLink = document.querySelector(".whatsapp")?.getAttribute("href")
    || "https://wa.me/212681222459";

  const actionBar = document.createElement("div");
  actionBar.className = "mobile-cta-bar";
  actionBar.innerHTML = [
    '<a class="mobile-call" href="tel:+212681222459">Appeler</a>',
    `<a class="mobile-chat" href="${whatsappLink}">WhatsApp</a>`
  ].join("");

  document.body.appendChild(actionBar);
}

function setMenuState(isOpen) {
  if (!menu || !overlay || !toggleButton) return;

  menu.classList.toggle("open", isOpen);
  overlay.classList.toggle("show", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  toggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function toggleMobileMenu() {
  if (!menu) return;
  setMenuState(!menu.classList.contains("open"));
}

function closeMobileMenu() {
  setMenuState(false);
}
