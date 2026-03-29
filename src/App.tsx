import { type FormEvent, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteLanguages, siteTranslations } from "../assets/translations.js";

gsap.registerPlugin(ScrollTrigger);

type LanguageCode = "fr" | "en" | "ar" | "es";
type SectionId = "home" | "about" | "gallery" | "programs" | "news" | "contact";
type GalleryMediaType = "image" | "video";
type GalleryMedia = {
  path: string;
  src: string;
  type: GalleryMediaType;
};

const languages = siteLanguages as Record<LanguageCode, { short: string; name: string; dir: "ltr" | "rtl" }>;
const translations = siteTranslations as Record<LanguageCode, any>;

const EMAIL = "lamaisondusavoir2025@gmail.com";
const PHONE = "0681222459";
const CALL_LINK = "tel:+212681222459";
const WHATSAPP_PRIMARY = "https://wa.me/212681222459";
const WHATSAPP_CONTACT = "https://wa.me/212724191970";
const ASSET_BASE = import.meta.env.BASE_URL;
const ABOUT_IMAGE_URL = `${ASSET_BASE}about-photo.jpeg`;
const DRAWING_NEWS_IMAGE = `${ASSET_BASE}news-drawing.jpeg`;
const ACUPUNCTURE_NEWS_IMAGE = `${ASSET_BASE}news-acupuncture.jpeg`;
const REGISTRATION_NEWS_IMAGE = `${ASSET_BASE}news-registration.jpeg`;
const DARIJA_NEWS_IMAGE = `${ASSET_BASE}news-darija.jpeg`;
const LOGO_URL = `${ASSET_BASE}logo.png`;
const picture2MediaModules = import.meta.glob("../.github/picture2/*.{jpeg,jpg,png,webp,avif,mp4,webm,mov}", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;
const GALLERY_MEDIA: GalleryMedia[] = Object.entries(picture2MediaModules)
  .map(([path, src]) => ({
    path,
    src,
    type: (/\.(mp4|webm|mov)$/i.test(path) ? "video" : "image") as GalleryMediaType
  }))
  .sort((a, b) => {
    if (a.type !== b.type) return a.type === "video" ? -1 : 1;

    return a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: "base" });
  });
const GALLERY_PREVIEW_COUNT = 4;
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
        badgeLine: "Lieu associatif d'apprentissage du primaire au lycée, CNED et ateliers à Ghazoua"
      },
      hero: {
        card: {
          text: "Lieu associatif d'apprentissage et de partage à Ghazoua. Accompagnement CNED du primaire au lycée en journée, ateliers de darija, dessin, poésie et peinture dans un cadre attentif."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir accompagne les élèves du primaire, du collège et du lycée inscrits au CNED dans un lieu associatif d'apprentissage et de partage, serein, stimulant et personnalisé."
      },
      info: {
        text: "Située à Ghazoua, route de Sidi Kaouki, La Maison du Savoir est un espace pensé pour la concentration, le partage et la progression de chaque enfant du primaire au lycée, avec des temps CNED et des ateliers créatifs."
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
        text: "Notre mission est d'offrir aux familles un lieu associatif de confiance où les élèves du primaire, du collège et du lycée peuvent suivre leur scolarité CNED avec méthode, sérénité, partage et motivation."
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
        text: "Chaque journée est pensée pour aider les élèves du primaire, du collège et du lycée à progresser avec régularité, confiance et plaisir d'apprendre, du suivi CNED aux ateliers de langue et d'expression."
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
        text: "Nous serons heureux d'échanger avec vous sur le parcours de votre enfant, ses besoins, son rythme d'apprentissage, son niveau du primaire au lycée et les ateliers proposés à Ghazoua."
      }
    }
  },
  en: {
    common: {
      topbar: {
        badgeLine: "Associative learning space from primary through high school, CNED and workshops in Ghazoua"
      },
      hero: {
        card: {
          text: "An associative place for learning and sharing in Ghazoua. Daytime CNED support from primary through high school, plus Darija workshops, drawing, poetry, and painting in a caring setting."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir supports primary, middle, and high school students enrolled in CNED in an associative space for learning and sharing: calm, stimulating, and personalized."
      },
      info: {
        text: "Located in Ghazoua on the road to Sidi Kaouki, La Maison du Savoir is a space designed for focus, sharing, and each child's progress from primary through high school, with CNED guidance and creative workshops."
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
        text: "Our mission is to offer families a trusted associative place where primary, middle, and high school students can follow their CNED schooling with method, calm, shared learning, and motivation."
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
        text: "Each day is designed to help primary, middle, and high school students progress with consistency, confidence, and joy in learning, from CNED follow-up to language and creative-expression workshops."
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
        text: "We would be delighted to talk with you about your child's path, learning rhythm, school level from primary through high school, CNED follow-up, and the workshops offered in Ghazoua."
      }
    }
  },
  ar: {
    common: {
      topbar: {
        badgeLine: "فضاء جمعوي للتعلّم من الابتدائي إلى الثانوي، ومرافقة CNED وورشات في غزوة"
      },
      hero: {
        card: {
          text: "فضاء جمعوي للتعلّم والتشارك في غزوة. مرافقة CNED نهاراً من الابتدائي إلى الثانوي مع ورشات في الدارجة والرسم والشعر والتلوين داخل أجواء مليئة بالعناية."
        }
      }
    },
    home: {
      section: {
        text: "يرافق بيت المعرفة تلاميذ الابتدائي والإعدادي والثانوي المسجلين في CNED داخل فضاء جمعوي للتعلّم والتشارك، هادئ ومحفّز ومخصّص لكل متعلّم."
      },
      info: {
        text: "يقع بيت المعرفة في غزوة على طريق سيدي كاوكي، وهو فضاء صُمم للتركيز والتشارك وتقدّم كل طفل من الابتدائي إلى الثانوي، مع أوقات CNED وورشات إبداعية."
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
        text: "مهمتنا هي أن نقدم للأسر فضاءً جمعوياً موثوقاً يتيح لتلاميذ الابتدائي والإعدادي والثانوي متابعة دراستهم مع CNED بمنهجية وطمأنينة وروح مشاركة وتحفيز."
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
        text: "كل يوم مُصمم لمساعدة تلاميذ الابتدائي والإعدادي والثانوي على التقدّم بثبات وثقة ومتعة في التعلّم، من متابعة CNED إلى ورشات اللغة والتعبير."
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
        text: "يسعدنا أن نتحدث معكم حول مسار طفلكم وإيقاع تعلّمه ومستواه من الابتدائي إلى الثانوي ومرافقة CNED والورشات المقترحة في غزوة."
      }
    }
  },
  es: {
    common: {
      topbar: {
        badgeLine: "Espacio asociativo de aprendizaje de primaria a liceo, CNED y talleres en Ghazoua"
      },
      hero: {
        card: {
          text: "Un espacio asociativo de aprendizaje y de compartir en Ghazoua. Acompañamiento CNED durante el día desde primaria hasta liceo, con talleres de darija, dibujo, poesía y pintura en un entorno atento."
        }
      }
    },
    home: {
      section: {
        text: "La Maison du Savoir acompaña a los alumnos de primaria, colegio y liceo inscritos en CNED dentro de un espacio asociativo de aprendizaje y de compartir, sereno, estimulante y personalizado."
      },
      info: {
        text: "Situada en Ghazoua, en la carretera de Sidi Kaouki, La Maison du Savoir es un espacio pensado para la concentración, el intercambio y el progreso de cada niño desde primaria hasta liceo, con tiempos CNED y talleres creativos."
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
        text: "Nuestra misión es ofrecer a las familias un lugar asociativo de confianza donde los alumnos de primaria, colegio y liceo puedan seguir su escolaridad CNED con método, serenidad, intercambio y motivación."
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
        text: "Cada jornada está pensada para ayudar a los alumnos de primaria, colegio y liceo a avanzar con regularidad, confianza y gusto por aprender, desde el seguimiento CNED hasta los talleres de lengua y expresión."
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
        text: "Estaremos encantados de hablar contigo sobre el recorrido de tu hijo, su ritmo de aprendizaje, su nivel de primaria a liceo, el seguimiento CNED y los talleres propuestos en Ghazoua."
      }
    }
  }
};

const siteExtras: Record<LanguageCode, any> = {
  fr: {
    nav: {
      steps: "Inscription",
      faq: "FAQ"
    },
    steps: {
      section: {
        eyebrow: "Inscription",
        title: "Comment s'inscrire en 3 étapes",
        text: "Un parcours simple pour rencontrer l'équipe, visiter le lieu et confirmer la place de votre enfant."
      },
      cards: {
        one: {
          title: "Écrivez-nous sur WhatsApp",
          text: "Partagez le niveau de votre enfant, vos attentes et vos disponibilités pour un premier échange rapide."
        },
        two: {
          title: "Venez visiter le lieu",
          text: "Découvrez les espaces, l'ambiance de travail et notre fonctionnement à Ghazoua avant de vous décider."
        },
        three: {
          title: "Confirmez la place",
          text: "Après l'échange, nous fixons ensemble les jours, le rythme et le démarrage de l'accompagnement."
        }
      },
      map: {
        eyebrow: "Nous trouver",
        title: "La Maison du Savoir - Ghazoua",
        text: "Le centre se situe route de Sidi Kaouki, à Ghazoua. Vous pouvez ouvrir l'itinéraire ou nous écrire avant votre visite.",
        location: "Ghazoua - Km 8, route de Sidi Kaouki",
        hours: "Visites sur rendez-vous",
        directions: "Ouvrir l'itinéraire",
        contact: "Écrire sur WhatsApp"
      }
    },
    faq: {
      section: {
        eyebrow: "FAQ",
        title: "Questions fréquentes",
        text: "Les réponses rapides aux questions les plus posées par les familles."
      },
      items: [
        {
          q: "Quels niveaux accompagnez-vous ?",
          a: "Nous accompagnons les élèves du primaire, du collège et du lycée inscrits au CNED dans un cadre calme et structuré."
        },
        {
          q: "Comment se passe l'inscription ?",
          a: "L'inscription commence par un message WhatsApp, puis une visite du lieu, avant la confirmation de la place."
        },
        {
          q: "Peut-on visiter avant de s'engager ?",
          a: "Oui, les familles peuvent visiter sur rendez-vous pour découvrir les espaces, l'équipe et l'organisation."
        },
        {
          q: "Y a-t-il des activités complémentaires ?",
          a: "Oui, nous proposons aussi des temps de darija, de dessin et d'autres ateliers d'expression selon la période."
        }
      ]
    }
  },
  en: {
    nav: {
      steps: "Steps",
      faq: "FAQ"
    },
    steps: {
      section: {
        eyebrow: "Registration",
        title: "How to register in 3 steps",
        text: "A simple path to meet the team, visit the center, and confirm your child's place."
      },
      cards: {
        one: {
          title: "Message us on WhatsApp",
          text: "Share your child's level, your expectations, and your availability for a quick first exchange."
        },
        two: {
          title: "Come visit the center",
          text: "Discover the rooms, the learning atmosphere, and how we work in Ghazoua before deciding."
        },
        three: {
          title: "Confirm the place",
          text: "After the discussion, we agree together on the days, rhythm, and start of the support."
        }
      },
      map: {
        eyebrow: "Find us",
        title: "La Maison du Savoir - Ghazoua",
        text: "The center is located on the Sidi Kaouki road in Ghazoua. You can open directions or message us before your visit.",
        location: "Ghazoua - Km 8, Sidi Kaouki road",
        hours: "Visits by appointment",
        directions: "Open directions",
        contact: "Message on WhatsApp"
      }
    },
    faq: {
      section: {
        eyebrow: "FAQ",
        title: "Frequently asked questions",
        text: "Quick answers to the questions families ask most often."
      },
      items: [
        {
          q: "Which school levels do you support?",
          a: "We support primary, middle, and high school students enrolled in CNED in a calm and structured setting."
        },
        {
          q: "How does registration work?",
          a: "Registration starts with a WhatsApp message, then a visit to the center, followed by confirmation of the place."
        },
        {
          q: "Can we visit before deciding?",
          a: "Yes, families can visit by appointment to discover the rooms, the team, and the organization."
        },
        {
          q: "Are there complementary activities?",
          a: "Yes, we also offer Darija, drawing, and other expression workshops depending on the period."
        }
      ]
    }
  },
  ar: {
    nav: {
      steps: "الخطوات",
      faq: "الأسئلة"
    },
    steps: {
      section: {
        eyebrow: "التسجيل",
        title: "كيف يتم التسجيل في 3 خطوات",
        text: "مسار بسيط للتعرّف على الفريق وزيارة الفضاء ثم تأكيد مكان طفلكم."
      },
      cards: {
        one: {
          title: "راسلونا على واتساب",
          text: "أرسلوا مستوى طفلكم واحتياجاته والأوقات المناسبة لكم من أجل أول تواصل سريع."
        },
        two: {
          title: "زوروا الفضاء",
          text: "اكتشفوا القاعات وأجواء العمل وطريقة التنظيم في غزوة قبل اتخاذ القرار."
        },
        three: {
          title: "أكدوا المكان",
          text: "بعد التواصل نحدد معاً الأيام والإيقاع وتاريخ انطلاق المرافقة."
        }
      },
      map: {
        eyebrow: "الموقع",
        title: "بيت المعرفة - غزوة",
        text: "يوجد المركز على طريق سيدي كاوكي في غزوة. يمكنكم فتح الاتجاهات أو مراسلتنا قبل الزيارة.",
        location: "غزوة - كلم 8، طريق سيدي كاوكي",
        hours: "الزيارات بموعد",
        directions: "فتح الاتجاهات",
        contact: "راسلونا على واتساب"
      }
    },
    faq: {
      section: {
        eyebrow: "الأسئلة الشائعة",
        title: "أسئلة متكررة",
        text: "إجابات سريعة عن أكثر الأسئلة التي تطرحها الأسر."
      },
      items: [
        {
          q: "ما هي المستويات التي تواكبونها؟",
          a: "نواكب تلاميذ الابتدائي والإعدادي والثانوي المسجلين في CNED داخل فضاء هادئ ومنظم."
        },
        {
          q: "كيف يتم التسجيل؟",
          a: "يبدأ التسجيل برسالة واتساب ثم زيارة للفضاء وبعدها يتم تأكيد المكان."
        },
        {
          q: "هل يمكن زيارة الفضاء قبل الالتزام؟",
          a: "نعم، يمكن للأسر زيارة الفضاء بموعد مسبق للتعرّف على القاعات والفريق وطريقة العمل."
        },
        {
          q: "هل توجد أنشطة مكمّلة؟",
          a: "نعم، توجد أيضاً حصص في الدارجة والرسم وورشات للتعبير حسب الفترة."
        }
      ]
    }
  },
  es: {
    nav: {
      steps: "Pasos",
      faq: "FAQ"
    },
    steps: {
      section: {
        eyebrow: "Inscripción",
        title: "Cómo inscribirse en 3 pasos",
        text: "Un recorrido simple para conocer al equipo, visitar el centro y confirmar la plaza de tu hijo."
      },
      cards: {
        one: {
          title: "Escríbenos por WhatsApp",
          text: "Comparte el nivel de tu hijo, tus necesidades y tu disponibilidad para un primer intercambio rápido."
        },
        two: {
          title: "Ven a visitar el centro",
          text: "Descubre los espacios, el ambiente de estudio y nuestra forma de trabajar en Ghazoua antes de decidir."
        },
        three: {
          title: "Confirma la plaza",
          text: "Después del intercambio, fijamos juntos los días, el ritmo y el inicio del acompañamiento."
        }
      },
      map: {
        eyebrow: "Ubicación",
        title: "La Maison du Savoir - Ghazoua",
        text: "El centro está situado en la carretera de Sidi Kaouki, en Ghazoua. Puedes abrir la ruta o escribirnos antes de tu visita.",
        location: "Ghazoua - Km 8, carretera de Sidi Kaouki",
        hours: "Visitas con cita previa",
        directions: "Abrir ruta",
        contact: "Escribir por WhatsApp"
      }
    },
    faq: {
      section: {
        eyebrow: "FAQ",
        title: "Preguntas frecuentes",
        text: "Respuestas rápidas a las preguntas que más hacen las familias."
      },
      items: [
        {
          q: "¿Qué niveles acompañan?",
          a: "Acompañamos a alumnos de primaria, colegio y liceo inscritos en CNED dentro de un entorno tranquilo y estructurado."
        },
        {
          q: "¿Cómo funciona la inscripción?",
          a: "La inscripción empieza con un mensaje por WhatsApp, luego una visita al centro y después la confirmación de la plaza."
        },
        {
          q: "¿Podemos visitar antes de decidir?",
          a: "Sí, las familias pueden visitar con cita previa para conocer los espacios, el equipo y la organización."
        },
        {
          q: "¿Hay actividades complementarias?",
          a: "Sí, también proponemos darija, dibujo y otros talleres de expresión según la temporada."
        }
      ]
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
  const [activeGalleryItem, setActiveGalleryItem] = useState<number | null>(null);
  const [showAllGalleryItems, setShowAllGalleryItems] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [, startTransition] = useTransition();

  const baseCopy = translations[language] ?? translations.fr;
  const copy = mergeCopy(baseCopy, copyEnhancements[language]);
  const extraCopy = siteExtras[language] ?? siteExtras.fr;
  const common = copy.common;
  const isRtl = languages[language].dir === "rtl";
  const activeMeta = copy.meta[activeSection] ?? copy.meta.contact ?? copy.meta.home;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir;
    document.body.classList.toggle("is-rtl", isRtl);
    document.body.classList.toggle("menu-open", menuOpen || activeGalleryItem !== null);

    try {
      window.localStorage.setItem("la-maison-language", language);
    } catch {
      // Ignore storage issues.
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [activeGalleryItem, isRtl, language, menuOpen]);

  useEffect(() => {
    document.title = activeMeta.title;
    updateMetaTag('meta[name="description"]', activeMeta.description);
    updateMetaTag('meta[property="og:title"]', activeMeta.title);
    updateMetaTag('meta[property="og:description"]', activeMeta.description);
  }, [activeMeta]);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      ticking = false;

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      setScrollProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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
    if (!menuOpen && activeGalleryItem === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeGalleryItem !== null) {
          setActiveGalleryItem(null);
          return;
        }

        setMenuOpen(false);
      }

      if (activeGalleryItem !== null && event.key === "ArrowRight") {
        setActiveGalleryItem((current) => (current === null ? 0 : (current + 1) % GALLERY_MEDIA.length));
      }

      if (activeGalleryItem !== null && event.key === "ArrowLeft") {
        setActiveGalleryItem((current) =>
          current === null ? GALLERY_MEDIA.length - 1 : (current - 1 + GALLERY_MEDIA.length) % GALLERY_MEDIA.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryItem, menuOpen]);

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

  const galleryVideoLabel =
    {
      fr: "Vidéo",
      en: "Video",
      ar: "فيديو",
      es: "Video"
    }[language] ?? "Video";
  const galleryCards = GALLERY_MEDIA.map((media, index) => ({
    ...media,
    index,
    alt: `${copy.gallery.section.title} ${index + 1}`
  }));
  const previewGalleryCards = galleryCards.slice(0, GALLERY_PREVIEW_COUNT);
  const visibleGalleryCards = showAllGalleryItems ? galleryCards : previewGalleryCards;
  const hasHiddenGalleryItems = galleryCards.length > GALLERY_PREVIEW_COUNT;
  const programCards = [copy.programs.cards.one, copy.programs.cards.two, copy.programs.cards.three];
  const stepCards = [extraCopy.steps.cards.one, extraCopy.steps.cards.two, extraCopy.steps.cards.three];
  const faqItems = extraCopy.faq.items as Array<{ q: string; a: string }>;
  const customAcupunctureNewsCard =
    {
      fr: {
        badge: "Bien-être",
        title: "Séances d'acupuncture à Essaouira",
        text: "Séances d'acupuncture à La Maison du Savoir - Ghazoua, du 27 mars au 3 avril, avec des créneaux variés pour le stress, le sommeil, la digestion, l'équilibre féminin et l'immunité."
      },
      en: {
        badge: "Well-being",
        title: "Acupuncture sessions in Essaouira",
        text: "Acupuncture sessions at La Maison du Savoir - Ghazoua, from March 27 to April 3, with several time slots focused on stress relief, sleep, digestion, feminine balance, and immunity."
      },
      ar: {
        badge: "العافية",
        title: "جلسات الوخز بالإبر في الصويرة",
        text: "جلسات وخز بالإبر في بيت المعرفة - غزوة من 27 مارس إلى 3 أبريل، مع مواعيد متنوعة لدعم التخفيف من التوتر والنوم والهضم والتوازن النسائي والمناعة."
      },
      es: {
        badge: "Bienestar",
        title: "Sesiones de acupuntura en Essaouira",
        text: "Sesiones de acupuntura en La Maison du Savoir - Ghazoua, del 27 de marzo al 3 de abril, con varios horarios orientados al estrés, el sueño, la digestión, el equilibrio femenino y la inmunidad."
      }
    }[language] ?? {
      badge: "Well-being",
      title: "Acupuncture sessions in Essaouira",
      text: "Acupuncture sessions at La Maison du Savoir - Ghazoua, from March 27 to April 3, with several time slots focused on stress relief, sleep, digestion, feminine balance, and immunity."
    };
  const newsCards = [
    { ...copy.news.cards.one, image: REGISTRATION_NEWS_IMAGE },
    { ...copy.news.cards.two, image: DRAWING_NEWS_IMAGE },
    { ...copy.news.cards.three, ...customAcupunctureNewsCard, image: ACUPUNCTURE_NEWS_IMAGE },
    { ...copy.news.cards.four, image: DARIJA_NEWS_IMAGE }
  ];
  const activeGalleryCard = activeGalleryItem !== null ? galleryCards[activeGalleryItem] : null;
  const galleryViewAllLabel =
    {
      fr: "Voir toute la galerie",
      en: "View full gallery",
      ar: "عرض جميع الصور",
      es: "Ver toda la galeria"
    }[language] ?? "View full gallery";
  const contactWhatsappIntro =
    {
      fr: "Bonjour, je souhaite obtenir plus d'informations.",
      en: "Hello, I would like more information.",
      ar: "مرحباً، أود الحصول على مزيد من المعلومات.",
      es: "Hola, me gustaría recibir más información."
    }[language] ?? "Hello, I would like more information.";
  const backToTopLabel =
    {
      fr: "Haut de page",
      en: "Back to top",
      ar: "العودة إلى الأعلى",
      es: "Volver arriba"
    }[language] ?? "Back to top";
  const contactFormNote =
    {
      fr: "Remplissez le formulaire et nous vous répondrons sur WhatsApp avec les informations utiles.",
      en: "Fill in the form and we will reply on WhatsApp with the most useful information.",
      ar: "املأوا الاستمارة وسنرد عليكم عبر واتساب بكل المعلومات المفيدة.",
      es: "Complete el formulario y le responderemos por WhatsApp con la información más útil."
    }[language] ?? "Fill in the form and we will reply on WhatsApp with the most useful information.";
  const showBackToTop = scrollProgress > 0.16;

  const handleContactWhatsappSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const parentName = String(formData.get("parentName") ?? "").trim();
    const contactInfo = String(formData.get("contactInfo") ?? "").trim();
    const studentLevel = String(formData.get("studentLevel") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const whatsappMessage = [
      contactWhatsappIntro,
      "",
      `${copy.contact.form.parent}: ${parentName}`,
      `${copy.contact.form.contact}: ${contactInfo}`,
      `${copy.contact.form.student}: ${studentLevel || "-"}`,
      `${copy.contact.form.message}: ${message}`
    ].join("\n");

    window.open(`${WHATSAPP_CONTACT}?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="page-shell">
      <div className="ambient-layer" aria-hidden="true">
        <div className="hero-orb hero-orb-one parallax-orb" />
        <div className="hero-orb hero-orb-two parallax-orb" />
        <div className="hero-orb hero-orb-three parallax-orb" />
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

          <div className="language-group nav-language-group desktop-language-group" aria-label={common.languageSwitcher}>
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

        <div className="scroll-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${scrollProgress})` }} />
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

          <div className="home-extras">
            <div className="home-extra-block">
              <SectionHeading
                eyebrow={extraCopy.steps.section.eyebrow}
                title={extraCopy.steps.section.title}
                text={extraCopy.steps.section.text}
              />

              <div className="shell steps-layout">
                <div className="steps-grid">
                  {stepCards.map((card, index) => (
                    <article key={card.title} className="step-card" data-reveal>
                      <span className="step-number">{index + 1}</span>
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-extra-block">
              <SectionHeading
                eyebrow={extraCopy.faq.section.eyebrow}
                title={extraCopy.faq.section.title}
                text={extraCopy.faq.section.text}
              />

              <div className="shell faq-list">
                {faqItems.map((item) => (
                  <details key={item.q} className="faq-item" data-reveal>
                    <summary>{item.q}</summary>
                    <p className="faq-answer">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
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
                  className="about-photo-illustration"
                  src={ABOUT_IMAGE_URL}
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
            {visibleGalleryCards.map((card) => (
              <article key={card.path} className={`gallery-card ${card.index === 0 ? "is-featured" : ""}`} data-reveal>
                <button
                  type="button"
                  className="gallery-open-button"
                  aria-label={card.type === "video" ? `${card.alt} (${galleryVideoLabel})` : card.alt}
                  onClick={() => setActiveGalleryItem(card.index)}
                >
                  <div className={`gallery-media gallery-media-${card.index + 1}`}>
                    {card.type === "video" ? (
                      <video src={card.src} muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
                    ) : (
                      <img src={card.src} alt={card.alt} loading="lazy" />
                    )}
                  </div>
                  <span className={`gallery-zoom-indicator ${card.type === "video" ? "is-video" : ""}`} aria-hidden="true">
                    {card.type === "video" ? galleryVideoLabel : "+"}
                  </span>
                </button>
              </article>
            ))}
          </div>

          {hasHiddenGalleryItems && !showAllGalleryItems ? (
            <div className="shell gallery-actions" data-reveal>
              <button
                type="button"
                className="secondary-action gallery-view-all-button"
                onClick={() => setShowAllGalleryItems(true)}
              >
                {galleryViewAllLabel}
              </button>
            </div>
          ) : null}
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
              <article
                key={card.title}
                className={`news-card tone-${newsAccents[index]}`}
                data-reveal
              >
                {card.image ? (
                  <div className="news-media">
                    <img src={card.image} alt={card.title} loading="lazy" />
                  </div>
                ) : null}
                <div className="news-card-body">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
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
              data-reveal
              onSubmit={handleContactWhatsappSubmit}
            >
              <p className="contact-form-note full-width">{contactFormNote}</p>
              <label className="contact-field">
                <span>{copy.contact.form.parent}</span>
                <input name="parentName" required />
              </label>
              <label className="contact-field">
                <span>{copy.contact.form.contact}</span>
                <input name="contactInfo" required />
              </label>
              <label className="contact-field full-width">
                <span>{copy.contact.form.student}</span>
                <input name="studentLevel" />
              </label>
              <label className="contact-field full-width">
                <span>{copy.contact.form.message}</span>
                <textarea name="message" required />
              </label>
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

      {activeGalleryItem !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeGalleryCard?.alt ?? "Gallery image"}>
          <button
            type="button"
            className="gallery-lightbox-backdrop"
            aria-label="Close image"
            onClick={() => setActiveGalleryItem(null)}
          />
          <div className="gallery-lightbox-shell">
            <button
              type="button"
              className="gallery-lightbox-close"
              aria-label="Close image"
              onClick={() => setActiveGalleryItem(null)}
            >
              <span />
              <span />
            </button>
            <button
              type="button"
              className="gallery-lightbox-nav gallery-lightbox-prev"
              aria-label="Previous image"
              onClick={() =>
                setActiveGalleryItem((current) =>
                  current === null ? GALLERY_MEDIA.length - 1 : (current - 1 + GALLERY_MEDIA.length) % GALLERY_MEDIA.length
                )
              }
            >
              <span>&lsaquo;</span>
            </button>
            <button
              type="button"
              className="gallery-lightbox-nav gallery-lightbox-next"
              aria-label="Next image"
              onClick={() =>
                setActiveGalleryItem((current) => (current === null ? 0 : (current + 1) % GALLERY_MEDIA.length))
              }
            >
              <span>&rsaquo;</span>
            </button>
            {activeGalleryCard?.type === "video" ? (
              <video src={activeGalleryCard.src} controls autoPlay playsInline />
            ) : (
              <img src={activeGalleryCard?.src ?? ""} alt={activeGalleryCard?.alt ?? ""} />
            )}
            <div className="gallery-lightbox-count">
              {activeGalleryItem + 1} / {GALLERY_MEDIA.length}
            </div>
          </div>
        </div>
      ) : null}

      <div className="floating-actions">
        {showBackToTop ? (
          <button type="button" className="secondary-action back-to-top-action" onClick={scrollToTop}>
            {backToTopLabel}
          </button>
        ) : null}
        <a className="whatsapp-action" href={WHATSAPP_PRIMARY} target="_blank" rel="noreferrer">
          {common.hero.whatsapp}
        </a>
      </div>
    </div>
  );
}

export default App;
