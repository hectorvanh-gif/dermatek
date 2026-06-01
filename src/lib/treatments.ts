import type { ShopifyProduct } from "@/lib/shopify";

export interface Treatment {
  slug: string;
  name: string;
  short: string;
  keywords: string[];
  hero: string;
  guide: {
    intro: string;
    bullets: { title: string; desc: string }[];
    howToChoose: string[];
  };
}

export const TREATMENTS: Treatment[] = [
  {
    slug: "rejuvenecimiento-facial",
    name: "Rejuvenecimiento facial",
    short: "Hidratación profunda, luminosidad y antiedad sin downtime.",
    keywords: ["facial", "hidrafacial", "hydrafacial", "radiofrecuencia", "antiage", "rejuven", "limpieza", "dermapen", "microdermo", "oxigeno"],
    hero: "Devuelve luminosidad, textura y firmeza al rostro con tratamientos no invasivos.",
    guide: {
      intro:
        "El rejuvenecimiento facial agrupa tecnologías que estimulan colágeno, mejoran textura y aportan luminosidad sin cirugía. Ideal para clínicas que buscan un ticket promedio alto con baja inversión por sesión.",
      bullets: [
        { title: "Hidrafacial / Aqua peel", desc: "Limpieza profunda + infusión de sérums. Cero downtime, alta rotación." },
        { title: "Radiofrecuencia facial", desc: "Calor controlado en dermis profunda. Tensa y mejora flacidez incipiente." },
        { title: "Dermapen / Microneedling", desc: "Inducción de colágeno con microagujas. Excelente para cicatrices y poros." },
      ],
      howToChoose: [
        "Si tu cliente busca volumen y rotación rápida: Hidrafacial.",
        "Si tu cliente paga por resultado visible a largo plazo: RF + Microneedling.",
        "Multi-tecnología en un solo equipo si arrancas y no quieres comprar 3 máquinas.",
      ],
    },
  },
  {
    slug: "reduccion-de-grasa",
    name: "Reducción de grasa y contorno",
    short: "Cavitación, criolipólisis y radiofrecuencia para modelar.",
    keywords: ["cavita", "criolipo", "criolip", "lipo", "grasa", "contorno", "modelad", "reduccion", "reducción"],
    hero: "Modela el contorno corporal con tecnologías no invasivas de eficacia clínica probada.",
    guide: {
      intro:
        "Tratamientos para reducir adiposidad localizada y mejorar contorno corporal. Suelen venderse en paquetes de 6–10 sesiones — ticket alto y recurrencia natural.",
      bullets: [
        { title: "Cavitación ultrasónica", desc: "Burbujas que rompen membrana adipocitaria. Indoloro, gran demanda." },
        { title: "Criolipólisis", desc: "Frío controlado que destruye células grasas. Resultados duraderos." },
        { title: "Radiofrecuencia corporal", desc: "Calor profundo, reduce circunferencia y mejora celulitis." },
      ],
      howToChoose: [
        "Equipo multifunción (cavitación + RF + vacuum) si recién entras al mercado corporal.",
        "Criolipólisis dedicada si tu clínica ya tiene cartera y busca diferenciarse.",
        "Considera tamaño de manípulos: más manípulos = más zonas por sesión = mayor ticket.",
      ],
    },
  },
  {
    slug: "depilacion",
    name: "Depilación definitiva",
    short: "Láser diodo, alejandrita e IPL para piel y vello variado.",
    keywords: ["depila", "depilación", "depilacion", "ipl", "diodo", "alejandrita", "nd:yag", "ndyag"],
    hero: "El segmento de mayor rotación y recompra en estética profesional.",
    guide: {
      intro:
        "La depilación láser es la puerta de entrada más rentable: alta demanda, paquetes recurrentes y resultados visibles desde la 3ª sesión.",
      bullets: [
        { title: "Diodo 808 nm", desc: "Estándar de oro. Funciona en todos los tonos de piel y vello." },
        { title: "Triple longitud (755+808+1064)", desc: "Mayor versatilidad clínica. Pieles bronceadas y vello fino." },
        { title: "IPL", desc: "Inversión inicial menor. Ideal para spas que no quieren certificación láser." },
      ],
      howToChoose: [
        "Si quieres ofrecer 'permanente' real: diodo o triple longitud.",
        "Sistema de enfriamiento -5°C o menor para sesiones largas sin dolor.",
        "Verifica potencia real (W) y vida útil de lámpara/diodo — no solo el precio.",
      ],
    },
  },
  {
    slug: "flacidez-y-lifting",
    name: "Flacidez y lifting",
    short: "HIFU y radiofrecuencia para tensar piel sin cirugía.",
    keywords: ["hifu", "flacidez", "lifting", "tensa", "ultrasonid"],
    hero: "Tensa facial y corporal con resultados visibles desde la primera sesión.",
    guide: {
      intro:
        "El HIFU es la tecnología no invasiva más cercana a un lifting quirúrgico. Tratamiento premium con margen alto por sesión.",
      bullets: [
        { title: "HIFU facial", desc: "Cartuchos 1.5/3.0/4.5 mm para distintas capas. Resultados a 90 días." },
        { title: "HIFU corporal", desc: "Cartuchos 8/13 mm. Reduce flacidez en abdomen, brazos, glúteos." },
        { title: "RF multipolar", desc: "Mantenimiento entre sesiones de HIFU. Confort alto." },
      ],
      howToChoose: [
        "Verifica número de disparos por cartucho — afecta directamente tu costo por sesión.",
        "Equipos con cartuchos intercambiables facial + corporal maximizan ROI.",
        "Pantalla con visualización de profundidad = más confianza del operador y paciente.",
      ],
    },
  },
  {
    slug: "tonificacion-muscular",
    name: "Tonificación muscular",
    short: "EMSzero y electroestimulación para musculatura y glúteos.",
    keywords: ["emszero", "ems", "electroestim", "muscular", "glute", "tone", "contracci"],
    hero: "Construye músculo y reduce grasa con contracciones supramaximales.",
    guide: {
      intro:
        "Tecnología de electromagnetismo focalizado (HI-EMT) que provoca 20.000+ contracciones por sesión. El servicio mejor pagado del segmento corporal.",
      bullets: [
        { title: "EMSzero 4 manípulos", desc: "Trata 2 zonas simultáneas. Ideal abdomen + glúteos." },
        { title: "EMS + RF combinado", desc: "Quema grasa y tonifica en la misma sesión." },
        { title: "Sillas EMS pélvico", desc: "Nicho creciente: incontinencia y suelo pélvico postparto." },
      ],
      howToChoose: [
        "Frecuencia real ≥ 7 Tesla para resultados clínicos en músculo profundo.",
        "Manípulos con cooling integrado = sesiones más cómodas, mayor reventa.",
        "Verifica certificaciones del fabricante — el mercado tiene muchas copias.",
      ],
    },
  },
  {
    slug: "manchas-y-acne",
    name: "Manchas, acné y pigmentación",
    short: "Láser Q-switched, IPL y peelings clínicos.",
    keywords: ["mancha", "acne", "acné", "pigment", "melasma", "q-switch", "qswitch", "picosegun", "peel"],
    hero: "Trata pigmentación, lesiones vasculares y secuelas de acné con precisión clínica.",
    guide: {
      intro:
        "Tratamientos dermatológicos de alta especialización. Clientela exigente, ticket alto y excelente boca a boca cuando los resultados acompañan.",
      bullets: [
        { title: "Láser Q-switched / Pico", desc: "Pigmentación profunda, tatuajes, melasma resistente." },
        { title: "IPL fototerapia", desc: "Manchas superficiales, rosácea, telangiectasias." },
        { title: "Peelings de cabina", desc: "Mantenimiento entre sesiones láser. Bajo costo, alta rotación." },
      ],
      howToChoose: [
        "Q-switched Nd:YAG para melasma y tatuajes en piel mixta latina.",
        "IPL con filtros intercambiables para versatilidad facial + vascular.",
        "Considera capacitación médica obligatoria — vende el equipo + el curso.",
      ],
    },
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}

export function matchesTreatment(product: ShopifyProduct, treatment: Treatment): boolean {
  const haystack = [
    product.node.title,
    product.node.description,
    product.node.productType,
    product.node.vendor,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return treatment.keywords.some((k) => haystack.includes(k.toLowerCase()));
}

export function productsForTreatment(products: ShopifyProduct[], slug: string): ShopifyProduct[] {
  const t = getTreatment(slug);
  if (!t) return [];
  return products.filter((p) => matchesTreatment(p, t));
}

export function treatmentsForProduct(product: ShopifyProduct): Treatment[] {
  return TREATMENTS.filter((t) => matchesTreatment(product, t));
}