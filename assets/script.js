
document.addEventListener("DOMContentLoaded", () => {
  const nodes = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.12 });
  nodes.forEach((n) => io.observe(n));

  document.querySelectorAll("#mobileMenu a").forEach((a) => {
    a.addEventListener("click", closeMobileMenu);
  });
});

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  if (!menu || !overlay) return;
  menu.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  if (!menu || !overlay) return;
  menu.classList.remove("open");
  overlay.classList.remove("show");
}
