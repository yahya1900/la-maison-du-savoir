let menu;
let overlay;
let toggleButton;

const LANGUAGE_STORAGE_KEY = "la-maison-language";

document.addEventListener("DOMContentLoaded", () => {
  menu = document.getElementById("mobileMenu");
  overlay = document.getElementById("mobileOverlay");
  toggleButton = document.querySelector(".menu-toggle");

  initReveal();
  renderLanguageSwitcher();
  mountMobileActionBar();
  initLanguage();
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

function renderLanguageSwitcher() {
  if (!window.SITE_LANGUAGES) return;

  const markup = Object.entries(window.SITE_LANGUAGES).map(([code, language]) => (
    `<button type="button" class="lang-button" data-set-language="${code}" lang="${code}" title="${language.name}" aria-label="${language.name}">${language.short}</button>`
  )).join("");

  document.querySelectorAll("[data-language-switcher]").forEach((slot) => {
    slot.innerHTML = markup;
    slot.setAttribute("role", "group");
  });

  document.querySelectorAll("[data-set-language]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.setLanguage);
    });
  });
}

function initLanguage() {
  const initialLanguage = getInitialLanguage();
  applyLanguage(initialLanguage, false);
}

function getInitialLanguage() {
  if (!window.SITE_LANGUAGES) return "fr";

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && window.SITE_LANGUAGES[storedLanguage]) {
      return storedLanguage;
    }
  } catch (error) {
    // Ignore storage access issues and fall back to browser/default language.
  }

  const browserLanguage = navigator.language
    ? navigator.language.slice(0, 2).toLowerCase()
    : "";

  return window.SITE_LANGUAGES[browserLanguage] ? browserLanguage : "fr";
}

function applyLanguage(languageCode, persist = true) {
  const supportedLanguage = window.SITE_LANGUAGES?.[languageCode] ? languageCode : "fr";
  const direction = window.SITE_LANGUAGES?.[supportedLanguage]?.dir || "ltr";

  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
    } catch (error) {
      // Ignore storage access issues and keep the language for the current page.
    }
  }

  document.documentElement.lang = supportedLanguage;
  document.documentElement.dir = direction;
  document.body.classList.toggle("is-rtl", direction === "rtl");

  translateDocument(supportedLanguage);
  syncLanguageButtons(supportedLanguage);
  updateMobileActionBar(supportedLanguage);
}

function translateDocument(languageCode) {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = getTranslation(languageCode, key);

    if (typeof value !== "string") return;

    if (node.dataset.i18nAttr) {
      node.setAttribute(node.dataset.i18nAttr, value);
      return;
    }

    node.textContent = value;
  });

  const switcherLabel = getTranslation(languageCode, "common.languageSwitcher");
  if (switcherLabel) {
    document.querySelectorAll("[data-language-switcher]").forEach((slot) => {
      slot.setAttribute("aria-label", switcherLabel);
    });
  }
}

function getTranslation(languageCode, key) {
  const activeLanguage = window.SITE_TRANSLATIONS?.[languageCode];
  const fallbackLanguage = window.SITE_TRANSLATIONS?.fr;

  return resolveTranslation(activeLanguage, key) ?? resolveTranslation(fallbackLanguage, key);
}

function resolveTranslation(dictionary, key) {
  if (!dictionary) return null;

  return key.split(".").reduce((value, segment) => (
    value && Object.prototype.hasOwnProperty.call(value, segment) ? value[segment] : null
  ), dictionary);
}

function syncLanguageButtons(languageCode) {
  document.querySelectorAll("[data-set-language]").forEach((button) => {
    const isActive = button.dataset.setLanguage === languageCode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
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

function updateMobileActionBar(languageCode) {
  const callButton = document.querySelector(".mobile-call");
  const chatButton = document.querySelector(".mobile-chat");

  if (callButton) {
    callButton.textContent = getTranslation(languageCode, "common.actions.call") || "Appeler";
  }

  if (chatButton) {
    chatButton.textContent = getTranslation(languageCode, "common.hero.whatsapp") || "WhatsApp";
  }
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
