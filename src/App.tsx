import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteLanguages, siteTranslations } from "../assets/translations.js";

gsap.registerPlugin(ScrollTrigger);

type LanguageCode = "fr" | "en" | "ar" | "es";
type SectionId = "home" | "about" | "gallery" | "programs" | "news" | "contact";

const languages = siteLanguages as Record<LanguageCode, { short: string; name: string; dir: "ltr" | "rtl" }>;
const translations = siteTranslations as Record<LanguageCode, any>;

const EMAIL = "lamaisondusavoir2025@gmail.com";
const PHONE = "0681222459";
const CALL_LINK = "tel:+212681222459";
const WHATSAPP_PRIMARY = "https://wa.me/212681222459";
const WHATSAPP_CONTACT = "https://wa.me/212724191970";
const FACEBOOK_PAGE = "https://web.facebook.com/people/La-maison-du-savoir/61576992321051/";
const ASSET_BASE = import.meta.env.BASE_URL;
const LOGO_URL = `${ASSET_BASE}logo.png`;
const GALLERY_IMAGES = [`${ASSET_BASE}gallery-1.jpg`, `${ASSET_BASE}gallery-2.jpg`, `${ASSET_BASE}gallery-3.jpg`] as const;
const sections: SectionId[] = ["home", "about", "gallery", "programs", "news", "contact"];
const stats: Array<{ value: number; key: "one" | "two" | "three" | "four"; prefix?: string }> = [
  { value: 2, key: "one" },
  { value: 3, key: "two" },
  { value: 100, key: "three", prefix: "+" },
  { value: 10, key: "four", prefix: "+" }
];
const programIcons = ["🏫", "🤝", "✨"] as const;
const newsAccents = ["sunrise", "ocean", "meadow"] as const;

function getInitialLanguage(): LanguageCode {
  const fallback: LanguageCode = "fr";

  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem("la-maison-language") as LanguageCode | null;
    if (stored && stored in languages) return stored;
  } catch {
    // Ignore storage issues.
  }

  const browserLanguage = window.navigator.language.slice(0, 2).toLowerCase() as LanguageCode;
  return browserLanguage in languages ? browserLanguage : fallback;
}

function updateMetaTag(selector: string, value: string) {
  const element = document.querySelector(selector);
  if (element instanceof HTMLMetaElement) element.content = value;
}

type HeadingProps = { eyebrow: string; title: string; text: string };

function SectionHeading({ eyebrow, title, text }: HeadingProps) {
  return (
    <div className="shell section-heading" data-reveal>
      <span className="section-kicker">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    home: null,
    about: null,
    gallery: null,
    programs: null,
    news: null,
    contact: null
  });

  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [, startTransition] = useTransition();

  const copy = translations[language] ?? translations.fr;
  const common = copy.common;
  const isRtl = languages[language].dir === "rtl";
  const activeMeta = copy.meta[activeSection] ?? copy.meta.home;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir;
    document.body.classList.toggle("is-rtl", isRtl);
    document.body.classList.toggle("menu-open", menuOpen);

    try {
      window.localStorage.setItem("la-maison-language", language);
    } catch {
      // Ignore storage issues.
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isRtl, language, menuOpen]);

  useEffect(() => {
    document.title = activeMeta.title;
    updateMetaTag('meta[name="description"]', activeMeta.description);
    updateMetaTag('meta[property="og:title"]', activeMeta.title);
    updateMetaTag('meta[property="og:description"]', activeMeta.description);
  }, [activeMeta]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-22% 0px -38% 0px"
      }
    );

    sections.forEach((section) => {
      const node = sectionRefs.current[section];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".intro-chip", { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 48, opacity: 0, duration: 0.85 }, "-=0.28")
        .from(".hero-copy", { y: 32, opacity: 0, duration: 0.7 }, "-=0.45")
        .from(".hero-actions > *", { y: 20, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=0.32")
        .from(".hero-pills > *", { y: 16, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.3")
        .from(".hero-card", { y: 54, opacity: 0, rotate: -2, duration: 0.95 }, "-=0.68");

      gsap.to(".float-mark", {
        y: -14,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 84%" }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax-orb").forEach((orb, index) => {
        gsap.to(orb, {
          yPercent: index % 2 === 0 ? -14 : 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".page-shell",
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
        const endValue = Number(node.dataset.count ?? 0);
        const prefix = node.dataset.prefix ?? "";
        const counter = { value: 0 };

        gsap.to(counter, {
          value: endValue,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
          onUpdate: () => {
            node.textContent = `${prefix}${Math.round(counter.value)}`;
          }
        });
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  const setSectionRef =
    (section: SectionId) =>
    (node: HTMLElement | null): void => {
      sectionRefs.current[section] = node;
    };

  const changeLanguage = (nextLanguage: LanguageCode) => {
    startTransition(() => {
      setLanguage(nextLanguage);
    });
  };

  const navItems = [
    { id: "home" as const, label: common.nav.home },
    { id: "about" as const, label: common.nav.about },
    { id: "gallery" as const, label: common.nav.gallery },
    { id: "programs" as const, label: common.nav.programs },
    { id: "news" as const, label: common.nav.news },
    { id: "contact" as const, label: common.nav.contact }
  ];

  const aboutItems = [
    copy.about.includes.one,
    copy.about.includes.two,
    copy.about.includes.three,
    copy.about.includes.four,
    copy.about.includes.five
  ];

  const galleryCards = [copy.gallery.cards.one, copy.gallery.cards.two, copy.gallery.cards.three];
  const programCards = [copy.programs.cards.one, copy.programs.cards.two, copy.programs.cards.three];
  const newsCards = [copy.news.cards.one, copy.news.cards.two, copy.news.cards.three];

  return (
    <div ref={rootRef} className="page-shell">
      <div className="ambient-layer" aria-hidden="true">
        <div className="hero-orb hero-orb-one parallax-orb" />
        <div className="hero-orb hero-orb-two parallax-orb" />
        <div className="hero-orb hero-orb-three parallax-orb" />
      </div>

      <div className="topbar">
        <div className="shell">
          <div className="topbar-meta">
            <span>{EMAIL}</span>
            <span>{PHONE}</span>
          </div>
          <div className="topbar-banner">
            <span className="badge">CNED</span>
            <span>{common.topbar.badgeLine}</span>
          </div>
          <div className="topbar-location">{common.topbar.location}</div>
          <div className="language-group" aria-label={common.languageSwitcher}>
            {(Object.keys(languages) as LanguageCode[]).map((code) => (
              <button
                key={code}
                type="button"
                className={`language-chip ${language === code ? "is-active" : ""}`}
                onClick={() => changeLanguage(code)}
                aria-pressed={language === code}
                lang={code}
                title={languages[code].name}
              >
                {languages[code].short}
              </button>
            ))}
          </div>
        </div>
      </div>

      <header className="main-nav">
        <div className="shell nav-row">
          <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
            <img src={LOGO_URL} alt={common.brand.alt} />
            <div className="brand-copy">
              <span className="brand-title">{common.brand.title}</span>
              <span className="brand-subtitle">{common.brand.subtitle}</span>
            </div>
          </a>

          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={common.menuToggle}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="site-navigation" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a className="nav-cta mobile-only" href="#contact" onClick={() => setMenuOpen(false)}>
              {common.nav.cta}
            </a>
          </nav>

          <a className="nav-cta desktop-only" href="#contact">
            {common.nav.cta}
          </a>
        </div>

        <button
          type="button"
          className={`mobile-backdrop ${menuOpen ? "is-visible" : ""}`}
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />
      </header>

      <main>
        <section id="home" ref={setSectionRef("home")} className="hero-section section-anchor">
          <div className="shell hero-grid">
            <div className="hero-copy-stack">
              <span className="intro-chip">{copy.home.hero.eyebrow}</span>
              <h1 className="hero-title">{copy.home.hero.title}</h1>
              <p className="hero-copy">{copy.home.hero.lead}</p>
              <div className="hero-actions">
                <a className="primary-action" href="#contact">
                  {common.hero.contactCta}
                </a>
                <a className="secondary-action" href={WHATSAPP_PRIMARY} target="_blank" rel="noreferrer">
                  {common.hero.whatsapp}
                </a>
              </div>
              <div className="hero-pills">
                <div>{common.hero.pills.calm}</div>
                <div>{common.hero.pills.personalized}</div>
                <div>{common.hero.pills.levels}</div>
              </div>
            </div>

            <div className="hero-card">
              <div className="card-shell">
                <span className="float-mark float-mark-one">❦</span>
                <span className="float-mark float-mark-two">❦</span>
                <img className="hero-logo" src={LOGO_URL} alt={common.hero.card.alt} />
                <div className="hero-card-label">{common.hero.card.location}</div>
                <div className="hero-card-title">{common.hero.card.levels}</div>
                <p>{common.hero.card.text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="shell two-column-grid">
            <article className="panel-card panel-card-light" data-reveal>
              <span className="section-kicker">{copy.home.section.eyebrow}</span>
              <h2>{copy.home.section.title}</h2>
              <p className="section-text">{copy.home.section.text}</p>
              <div className="feature-grid">
                <div className="feature-card">{copy.home.section.checks.one}</div>
                <div className="feature-card">{copy.home.section.checks.two}</div>
                <div className="feature-card">{copy.home.section.checks.three}</div>
                <div className="feature-card">{copy.home.section.checks.four}</div>
              </div>
            </article>

            <aside className="panel-card panel-card-dark" data-reveal>
              <div className="panel-tag">{common.hero.card.location}</div>
              <h3>{copy.home.info.title}</h3>
              <p>{copy.home.info.text}</p>
              <div className="contact-lines">
                <span>{copy.home.info.location}</span>
                <span>{copy.home.info.phone}</span>
                <span>{copy.home.info.schedule}</span>
              </div>
              <blockquote>{copy.home.info.quote}</blockquote>
            </aside>
          </div>

          <div className="shell highlights-grid">
            <article className="highlight-card" data-reveal>
              <span className="highlight-icon">📘</span>
              <h3>{copy.home.cards.one.title}</h3>
              <p>{copy.home.cards.one.text}</p>
            </article>
            <article className="highlight-card" data-reveal>
              <span className="highlight-icon">🎓</span>
              <h3>{copy.home.cards.two.title}</h3>
              <p>{copy.home.cards.two.text}</p>
            </article>
            <article className="highlight-card" data-reveal>
              <span className="highlight-icon">🌿</span>
              <h3>{copy.home.cards.three.title}</h3>
              <p>{copy.home.cards.three.text}</p>
            </article>
          </div>
        </section>

        <section id="about" ref={setSectionRef("about")} className="section-shell section-anchor">
          <SectionHeading
            eyebrow={copy.about.section.eyebrow}
            title={copy.about.section.title}
            text={copy.about.section.text}
          />

          <div className="shell about-grid">
            <div className="about-media" data-reveal>
              <div className="photo-frame">
                <img
                  src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1400&q=80"
                  alt={copy.about.photoAlt}
                />
              </div>
            </div>

            <div className="about-content" data-reveal>
              <h3>{copy.about.includes.title}</h3>
              <ul className="check-list">
                {aboutItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <article key={stat.key} className="stat-card">
                    <span className="stat-value" data-count={stat.value} data-prefix={stat.prefix ?? ""}>
                      {`${stat.prefix ?? ""}${stat.value}`}
                    </span>
                    <span className="stat-label">{copy.about.stats[stat.key]}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" ref={setSectionRef("gallery")} className="section-shell section-anchor">
          <SectionHeading
            eyebrow={copy.gallery.section.eyebrow}
            title={copy.gallery.section.title}
            text={copy.gallery.section.text}
          />

          <div className="shell gallery-grid">
            {galleryCards.map((card, index) => (
              <article
                key={card.label}
                className={`gallery-card ${index === 0 ? "gallery-card-feature" : "gallery-card-detail"}`}
                data-reveal
              >
                <div className={`gallery-media gallery-media-${index + 1}`}>
                  <img src={GALLERY_IMAGES[index]} alt={card.alt} loading="lazy" />
                </div>
                <div className="gallery-copy">
                  <span className="gallery-label">{card.label}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="shell gallery-actions" data-reveal>
            <a className="secondary-action" href={FACEBOOK_PAGE} target="_blank" rel="noreferrer">
              {copy.gallery.section.cta}
            </a>
          </div>
        </section>

        <section id="programs" ref={setSectionRef("programs")} className="section-shell section-anchor">
          <SectionHeading
            eyebrow={copy.programs.section.eyebrow}
            title={copy.programs.section.title}
            text={copy.programs.section.text}
          />

          <div className="shell cards-grid">
            {programCards.map((card, index) => (
              <article key={card.title} className="program-card" data-reveal>
                <span className="program-icon">{programIcons[index]}</span>
                <span className="program-badge">{card.badge}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <a href="#contact">{common.actions.moreInfo}</a>
              </article>
            ))}
          </div>
        </section>

        <section id="news" ref={setSectionRef("news")} className="section-shell section-anchor">
          <SectionHeading
            eyebrow={copy.news.section.eyebrow}
            title={copy.news.section.title}
            text={copy.news.section.text}
          />

          <div className="shell cards-grid">
            {newsCards.map((card, index) => (
              <article key={card.title} className={`news-card tone-${newsAccents[index]}`} data-reveal>
                <span className="news-badge">{card.badge}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" ref={setSectionRef("contact")} className="section-shell section-anchor">
          <SectionHeading
            eyebrow={copy.contact.section.eyebrow}
            title={copy.contact.section.title}
            text={copy.contact.section.text}
          />

          <div className="shell contact-grid">
            <aside className="contact-panel" data-reveal>
              <h3>{copy.contact.panel.title}</h3>
              <p>{common.hero.card.text}</p>
              <div className="contact-lines">
                <span>{EMAIL}</span>
                <span>{PHONE}</span>
                <span>{copy.contact.panel.location}</span>
                <span>{copy.contact.panel.schedule}</span>
              </div>
              <div className="contact-actions">
                <a className="primary-action" href={WHATSAPP_CONTACT} target="_blank" rel="noreferrer">
                  {common.hero.whatsapp}
                </a>
                <a className="secondary-action on-dark" href={CALL_LINK}>
                  {common.actions.call}
                </a>
              </div>
            </aside>

            <form
              className="contact-form"
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              data-reveal
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />
              <input name="parentName" placeholder={copy.contact.form.parent} required />
              <input name="contactInfo" placeholder={copy.contact.form.contact} required />
              <input className="full-width" name="studentLevel" placeholder={copy.contact.form.student} />
              <textarea className="full-width" name="message" placeholder={copy.contact.form.message} required />
              <button className="form-submit full-width" type="submit">
                {copy.contact.form.submit}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-grid">
          <div>
            <h4>{common.footer.brandTitle}</h4>
            <p>{common.footer.subtitle}</p>
          </div>
          <div>
            <h4>{common.footer.contact}</h4>
            <p>{PHONE}</p>
            <p>{EMAIL}</p>
            <p>{copy.contact.panel.location}</p>
          </div>
          <div>
            <h4>{common.footer.pages}</h4>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <div className="floating-actions">
        <a href={WHATSAPP_PRIMARY} target="_blank" rel="noreferrer">
          {common.hero.whatsapp}
        </a>
        <a href={CALL_LINK}>{common.actions.call}</a>
      </div>
    </div>
  );
}

export default App;
