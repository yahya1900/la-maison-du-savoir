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
const DRAWING_POST_URL =
  "https://web.facebook.com/61576992321051/posts/cours-de-dessin-%C3%A0-la-pause/122094291644899744/";
const DARIJA_POST_URL =
  "https://web.facebook.com/61576992321051/posts/aji-t3alam-m3ana-darija-koul-larb3a-f-far-lma3rifa-f-ghazwa-km8-%EF%B8%8F-viens-apprendr/122159458256899744/";
const POETRY_POST_URL =
  "https://web.facebook.com/61576992321051/posts/cours-libre-de-po%C3%A9sie-et-peinture-du-vendredi-un-beau-moment-avec-les-enfants%EF%B8%8Fme/122153624432899744/";
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
const newsAccents = ["sunrise", "ocean", "meadow", "sunrise"] as const;

const copyEnhancements: Record<LanguageCode, any> = {
  fr: {
    common: {
      topbar: {
        badgeLine: "Lieu associatif d'apprentissage, CNED et ateliers à Ghazoua"
      },
      hero: {
        card: {
          text: "Lieu associatif d'apprentissage et de partage à Ghazoua. Accompagnement CNED en journée, ateliers de darija, dessin, poésie et peinture dans un cadre attentif."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir accompagne les élèves du primaire et du collège inscrits au CNED dans un lieu associatif d'apprentissage et de partage, serein, stimulant et personnalisé."
      },
      info: {
        text: "Située à Ghazoua, route de Sidi Kaouki, La Maison du Savoir est un espace pensé pour la concentration, le partage et la progression de chaque enfant, avec des temps CNED et des ateliers créatifs."
      },
      cards: {
        three: {
          title: "Darija, dessin et expression",
          text: "Cours de dessin à la pause, darija chaque mercredi, poésie et peinture le vendredi, avec l'envie d'ouvrir aussi des temps de dessin le samedi."
        }
      }
    },
    about: {
      section: {
        text: "Notre mission est d'offrir aux familles un lieu associatif de confiance où les élèves peuvent suivre leur scolarité CNED avec méthode, sérénité, partage et motivation."
      },
      includes: {
        five: "Activités complémentaires : darija le mercredi, poésie et peinture le vendredi, ateliers créatifs et pratique du dessin"
      }
    },
    gallery: {
      section: {
        text: "Une galerie inspirée des images partagées sur Facebook, entre dessin, ateliers et moments de vie à La Maison du Savoir."
      }
    },
    programs: {
      section: {
        text: "Chaque journée est pensée pour aider les élèves à progresser avec régularité, confiance et plaisir d'apprendre, du suivi CNED aux ateliers de langue et d'expression."
      },
      cards: {
        three: {
          title: "Darija, poésie, peinture et dessin",
          text: "Des rendez-vous hebdomadaires inspirés de la vie du lieu : darija le mercredi, poésie et peinture le vendredi, dessin et pratique créative."
        }
      }
    },
    news: {
      section: {
        text: "Retrouvez ici les ouvertures d'inscriptions, visites, cours de dessin, darija et autres nouveautés de La Maison du Savoir."
      },
      cards: {
        two: {
          badge: "Atelier dessin",
          title: "Cours de dessin à la pause",
          text: "Un moment créatif partagé pendant la pause pour observer, imaginer et dessiner ensemble.",
          linkLabel: "Voir la publication Facebook"
        },
        three: {
          badge: "Vendredi créatif",
          title: "Poésie et peinture avec les enfants",
          text: "Le vendredi, un cours libre réunit les enfants autour de la poésie, de la peinture et d'un beau temps de partage.",
          linkLabel: "Voir la publication Facebook"
        },
        four: {
          badge: "Chaque mercredi",
          text: "Viens apprendre le darija avec nous chaque mercredi à La Maison du Savoir, Ghazoua Km 8."
        }
      }
    },
    contact: {
      section: {
        text: "Nous serons heureux d'échanger avec vous sur le parcours de votre enfant, ses besoins, son rythme d'apprentissage et les ateliers proposés à Ghazoua."
      }
    }
  },
  en: {
    common: {
      topbar: {
        badgeLine: "Associative learning space, CNED and workshops in Ghazoua"
      },
      hero: {
        card: {
          text: "An associative place for learning and sharing in Ghazoua. Daytime CNED support, Darija workshops, drawing, poetry, and painting in a caring setting."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir supports primary and middle school students enrolled in CNED in an associative space for learning and sharing: calm, stimulating, and personalized."
      },
      info: {
        text: "Located in Ghazoua on the road to Sidi Kaouki, La Maison du Savoir is a space designed for focus, sharing, and each child's progress, with CNED guidance and creative workshops."
      },
      cards: {
        three: {
          title: "Darija, drawing, and expression",
          text: "Drawing classes during the break, Darija every Wednesday, poetry and painting on Fridays, with the wish to open drawing practice on Saturdays too."
        }
      }
    },
    about: {
      section: {
        text: "Our mission is to offer families a trusted associative place where students can follow their CNED schooling with method, calm, shared learning, and motivation."
      },
      includes: {
        five: "Complementary activities: Darija on Wednesdays, poetry and painting on Fridays, creative workshops, and drawing practice"
      }
    },
    gallery: {
      section: {
        text: "A gallery inspired by the images shared on Facebook, featuring drawing, workshops, and daily moments at La Maison du Savoir."
      }
    },
    programs: {
      section: {
        text: "Each day is designed to help students progress with consistency, confidence, and joy in learning, from CNED follow-up to language and creative-expression workshops."
      },
      cards: {
        three: {
          title: "Darija, poetry, painting, and drawing",
          text: "Weekly moments inspired by life at the center: Darija on Wednesdays, poetry and painting on Fridays, and creative drawing practice."
        }
      }
    },
    news: {
      section: {
        text: "Find registration openings, visits, drawing classes, Darija sessions, and new updates from La Maison du Savoir here."
      },
      cards: {
        two: {
          badge: "Drawing",
          title: "Drawing class during the break",
          text: "A shared creative moment during the break to observe, imagine, and draw together.",
          linkLabel: "View the Facebook post"
        },
        three: {
          badge: "Friday",
          title: "Poetry and painting with the children",
          text: "On Fridays, a free session brings children together around poetry, painting, and a beautiful shared moment.",
          linkLabel: "View the Facebook post"
        },
        four: {
          badge: "Every Wednesday",
          text: "Join us every Wednesday to learn Darija at La Maison du Savoir, Ghazoua Km 8."
        }
      }
    },
    contact: {
      section: {
        text: "We would be delighted to talk with you about your child's path, learning rhythm, CNED follow-up, and the workshops offered in Ghazoua."
      }
    }
  },
  ar: {
    common: {
      topbar: {
        badgeLine: "فضاء جمعوي للتعلّم، ومرافقة CNED وورشات في غزوة"
      },
      hero: {
        card: {
          text: "فضاء جمعوي للتعلّم والتشارك في غزوة. مرافقة CNED نهاراً مع ورشات في الدارجة والرسم والشعر والتلوين داخل أجواء مليئة بالعناية."
        }
      }
    },
    home: {
      section: {
        text: "يرافق بيت المعرفة تلاميذ الابتدائي والإعدادي المسجلين في CNED داخل فضاء جمعوي للتعلّم والتشارك، هادئ ومحفّز ومخصّص لكل متعلّم."
      },
      info: {
        text: "يقع بيت المعرفة في غزوة على طريق سيدي كاوكي، وهو فضاء صُمم للتركيز والتشارك وتقدّم كل طفل، مع أوقات CNED وورشات إبداعية."
      },
      cards: {
        three: {
          title: "الدارجة والرسم والتعبير",
          text: "دروس رسم خلال الاستراحة، ودارجة كل أربعاء، وشعر وتلوين يوم الجمعة، مع الرغبة في تخصيص أوقات للرسم يوم السبت أيضاً."
        }
      }
    },
    about: {
      section: {
        text: "مهمتنا هي أن نقدم للأسر فضاءً جمعوياً موثوقاً يتيح للتلاميذ متابعة دراستهم مع CNED بمنهجية وطمأنينة وروح مشاركة وتحفيز."
      },
      includes: {
        five: "أنشطة مكمّلة: الدارجة يوم الأربعاء، والشعر والتلوين يوم الجمعة، وورشات إبداعية وممارسة الرسم"
      }
    },
    gallery: {
      section: {
        text: "معرض مستوحى من الصور التي نشاركها على فيسبوك، بين الرسم والورشات ولحظات الحياة داخل بيت المعرفة."
      }
    },
    programs: {
      section: {
        text: "كل يوم مُصمم لمساعدة التلاميذ على التقدّم بثبات وثقة ومتعة في التعلّم، من متابعة CNED إلى ورشات اللغة والتعبير."
      },
      cards: {
        three: {
          title: "الدارجة والشعر والتلوين والرسم",
          text: "مواعيد أسبوعية مستوحاة من حياة الفضاء: الدارجة يوم الأربعاء، والشعر والتلوين يوم الجمعة، والرسم والتجارب الإبداعية."
        }
      }
    },
    news: {
      section: {
        text: "هنا تجد مواعيد التسجيل والزيارات ودروس الرسم وحصص الدارجة وآخر مستجدات بيت المعرفة."
      },
      cards: {
        two: {
          badge: "الرسم",
          title: "درس الرسم أثناء الاستراحة",
          text: "لحظة إبداعية مشتركة خلال الاستراحة لملاحظة الأشياء والتخيل والرسم معاً.",
          linkLabel: "عرض منشور فيسبوك"
        },
        three: {
          badge: "الجمعة",
          title: "الشعر والتلوين مع الأطفال",
          text: "يوم الجمعة يجمع درس حر الأطفال حول الشعر والتلوين ولحظة جميلة من المشاركة.",
          linkLabel: "عرض منشور فيسبوك"
        },
        four: {
          badge: "كل أربعاء",
          text: "انضم إلينا كل يوم أربعاء لتعلّم الدارجة في بيت المعرفة، غزوة كلم 8."
        }
      }
    },
    contact: {
      section: {
        text: "يسعدنا أن نتحدث معكم حول مسار طفلكم وإيقاع تعلّمه ومرافقة CNED والورشات المقترحة في غزوة."
      }
    }
  },
  es: {
    common: {
      topbar: {
        badgeLine: "Espacio asociativo de aprendizaje, CNED y talleres en Ghazoua"
      },
      hero: {
        card: {
          text: "Un espacio asociativo de aprendizaje y de compartir en Ghazoua. Acompañamiento CNED durante el día con talleres de darija, dibujo, poesía y pintura en un entorno atento."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir acompaña a los alumnos de primaria y colegio inscritos en CNED dentro de un espacio asociativo de aprendizaje y de compartir, sereno, estimulante y personalizado."
      },
      info: {
        text: "Situada en Ghazoua, en la carretera de Sidi Kaouki, La Maison du Savoir es un espacio pensado para la concentración, el intercambio y el progreso de cada niño, con tiempos CNED y talleres creativos."
      },
      cards: {
        three: {
          title: "Darija, dibujo y expresión",
          text: "Clases de dibujo en la pausa, darija cada miércoles, poesía y pintura los viernes, con ganas de abrir también momentos de dibujo los sábados."
        }
      }
    },
    about: {
      section: {
        text: "Nuestra misión es ofrecer a las familias un lugar asociativo de confianza donde los alumnos puedan seguir su escolaridad CNED con método, serenidad, intercambio y motivación."
      },
      includes: {
        five: "Actividades complementarias: darija los miércoles, poesía y pintura los viernes, talleres creativos y práctica de dibujo"
      }
    },
    gallery: {
      section: {
        text: "Una galería inspirada en las imágenes compartidas en Facebook, entre dibujo, talleres y momentos de vida en La Maison du Savoir."
      }
    },
    programs: {
      section: {
        text: "Cada jornada está pensada para ayudar a los alumnos a avanzar con regularidad, confianza y gusto por aprender, desde el seguimiento CNED hasta los talleres de lengua y expresión."
      },
      cards: {
        three: {
          title: "Darija, poesía, pintura y dibujo",
          text: "Encuentros semanales inspirados en la vida del lugar: darija los miércoles, poesía y pintura los viernes, dibujo y práctica creativa."
        }
      }
    },
    news: {
      section: {
        text: "Encuentra aquí aperturas de inscripción, visitas, clases de dibujo, sesiones de darija y otras novedades de La Maison du Savoir."
      },
      cards: {
        two: {
          badge: "Dibujo",
          title: "Clase de dibujo en la pausa",
          text: "Un momento creativo compartido durante la pausa para observar, imaginar y dibujar juntos.",
          linkLabel: "Ver la publicación en Facebook"
        },
        three: {
          badge: "Viernes",
          title: "Poesía y pintura con los niños",
          text: "Los viernes, una sesión libre reúne a los niños alrededor de la poesía, la pintura y un bello momento compartido.",
          linkLabel: "Ver la publicación en Facebook"
        },
        four: {
          badge: "Cada miércoles",
          text: "Ven a aprender darija con nosotros cada miércoles en La Maison du Savoir, Ghazoua Km 8."
        }
      }
    },
    contact: {
      section: {
        text: "Estaremos encantados de hablar contigo sobre el recorrido de tu hijo, su ritmo de aprendizaje, el seguimiento CNED y los talleres propuestos en Ghazoua."
      }
    }
  }
};

function mergeCopy(base: any, overrides: any): any {
  if (!overrides) return base;

  const result = Array.isArray(base) ? [...base] : { ...base };

  Object.entries(overrides).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = mergeCopy(result[key] ?? {}, value);
      return;
    }

    result[key] = value;
  });

  return result;
}

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
  const [activeGalleryImage, setActiveGalleryImage] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [, startTransition] = useTransition();

  const baseCopy = translations[language] ?? translations.fr;
  const copy = mergeCopy(baseCopy, copyEnhancements[language]);
  const common = copy.common;
  const isRtl = languages[language].dir === "rtl";
  const activeMeta = copy.meta[activeSection] ?? copy.meta.home;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir;
    document.body.classList.toggle("is-rtl", isRtl);
    document.body.classList.toggle("menu-open", menuOpen || activeGalleryImage !== null);

    try {
      window.localStorage.setItem("la-maison-language", language);
    } catch {
      // Ignore storage issues.
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [activeGalleryImage, isRtl, language, menuOpen]);

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

  useEffect(() => {
    if (!menuOpen && activeGalleryImage === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeGalleryImage !== null) {
          setActiveGalleryImage(null);
          return;
        }

        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryImage, menuOpen]);

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
      if (window.innerWidth <= 920) {
        setMenuOpen(false);
      }
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
  const newsCards = [
    { ...copy.news.cards.one },
    { ...copy.news.cards.two, url: DRAWING_POST_URL },
    { ...copy.news.cards.three, url: POETRY_POST_URL },
    { ...copy.news.cards.four, url: DARIJA_POST_URL }
  ];
  const activeGalleryCard = activeGalleryImage !== null ? galleryCards[activeGalleryImage] : null;

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
            className={`mobile-menu-button ${menuOpen ? "is-open" : ""}`}
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
            <div className="mobile-nav-header">
              <div className="mobile-nav-brand">
                <img src={LOGO_URL} alt={common.brand.alt} />
                <div className="mobile-nav-brand-copy">
                  <span className="mobile-nav-location">{common.topbar.location}</span>
                  <span className="mobile-nav-title">{common.brand.title}</span>
                </div>
              </div>
              <button
                type="button"
                className="mobile-close-button"
                aria-label={common.menuToggle}
                onClick={() => setMenuOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>
            <div className="mobile-nav-meta">
              <span className="badge">CNED</span>
              <span>{common.topbar.badgeLine}</span>
            </div>
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
            <div className="mobile-nav-section">
              <span className="mobile-nav-section-title">{common.languageSwitcher}</span>
              <div className="language-group nav-language-group" aria-label={common.languageSwitcher}>
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
            <div className="mobile-nav-actions">
              <a
                className="secondary-action whatsapp-action"
                href={WHATSAPP_PRIMARY}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                {common.hero.whatsapp}
              </a>
              <a className="secondary-action" href={CALL_LINK} onClick={() => setMenuOpen(false)}>
                {common.actions.call}
              </a>
            </div>
          </nav>
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
                <a className="secondary-action whatsapp-action" href={WHATSAPP_PRIMARY} target="_blank" rel="noreferrer">
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
                key={card.alt}
                className={`gallery-card ${index === 0 ? "gallery-card-feature" : "gallery-card-detail"}`}
                data-reveal
              >
                <button
                  type="button"
                  className="gallery-open-button"
                  aria-label={card.alt}
                  onClick={() => setActiveGalleryImage(index)}
                >
                  <div className={`gallery-media gallery-media-${index + 1}`}>
                    <img src={GALLERY_IMAGES[index]} alt={card.alt} loading="lazy" />
                  </div>
                  <span className="gallery-zoom-indicator" aria-hidden="true">
                    +
                  </span>
                </button>
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
                {card.linkLabel ? (
                  <a className="news-link" href={card.url} target="_blank" rel="noreferrer">
                    {card.linkLabel}
                  </a>
                ) : null}
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
                <a className="primary-action whatsapp-action" href={WHATSAPP_CONTACT} target="_blank" rel="noreferrer">
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

      {activeGalleryImage !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeGalleryCard?.alt ?? "Gallery image"}>
          <button
            type="button"
            className="gallery-lightbox-backdrop"
            aria-label="Close image"
            onClick={() => setActiveGalleryImage(null)}
          />
          <div className="gallery-lightbox-shell">
            <button
              type="button"
              className="gallery-lightbox-close"
              aria-label="Close image"
              onClick={() => setActiveGalleryImage(null)}
            >
              <span />
              <span />
            </button>
            <img src={GALLERY_IMAGES[activeGalleryImage]} alt={activeGalleryCard?.alt ?? ""} />
          </div>
        </div>
      ) : null}

      <div className="floating-actions">
        <a className="whatsapp-action" href={WHATSAPP_PRIMARY} target="_blank" rel="noreferrer">
          {common.hero.whatsapp}
        </a>
      </div>
    </div>
  );
}

export default App;
