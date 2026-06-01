import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, Sparkles, ShieldCheck, Award, MessageCircle, GitCompareArrows } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { QuoteButton } from "@/components/QuoteButton";
import { useCartSync } from "@/hooks/useCartSync";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { TREATMENTS, productsForTreatment } from "@/lib/treatments";
import heroImage from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import imgRejuvenecimiento from "@/assets/treatment-rejuvenecimiento.jpg";
import imgReduccion from "@/assets/treatment-reduccion.jpg";
import imgDepilacion from "@/assets/treatment-depilacion.jpg";
import imgFlacidez from "@/assets/treatment-flacidez.jpg";
import imgTonificacion from "@/assets/treatment-tonificacion.jpg";
import imgManchas from "@/assets/treatment-manchas.jpg";

const TREATMENT_IMAGES: Record<string, string> = {
  "rejuvenecimiento-facial": imgRejuvenecimiento,
  "reduccion-de-grasa": imgReduccion,
  depilacion: imgDepilacion,
  "flacidez-y-lifting": imgFlacidez,
  "tonificacion-muscular": imgTonificacion,
  "manchas-y-acne": imgManchas,
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DermaTek | Equipos de Depilación y Aparatología Estética Profesional" },
      { name: "description", content: "DermaTek: equipos profesionales de depilación láser, HIFU, hidrafacial, radiofrecuencia y EMSzero. Aparatología estética premium para clínicas y spas." },
      { property: "og:title", content: "DermaTek | Equipos de Depilación y Aparatología Estética Profesional" },
      { property: "og:description", content: "Equipos profesionales de depilación láser y aparatología estética para clínicas. Tecnología de alta gama, asesoría clínica y garantía." },
      { property: "og:url", content: "https://friendly-shopify.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://friendly-shopify.lovable.app/" },
    ],
  }),
});

function Index() {
  useCartSync();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100, query: null });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  const products = data ?? [];
  const featured = products.slice(0, 8);

  const treatmentImage = (slug: string) => TREATMENT_IMAGES[slug];
  const treatmentCount = (slug: string) => productsForTreatment(products, slug).length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <video
          src={heroVideo.url}
          poster={heroImage}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Equipos de aparatología estética DermaTek"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-white mb-6 max-w-4xl [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
            Equipos profesionales de{" "}
            <span className="italic text-accent">depilación</span>{" "}
            y aparatología estética
          </h1>
          <p className="font-display text-xl md:text-2xl text-white/90 leading-snug mb-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
            Elige por <span className="italic">tratamiento</span>, no por marca.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              to="/catalogo"
              search={{ sort: "newest" }}
              className="inline-flex items-center gap-3 h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs uppercase tracking-[0.25em] font-medium"
            >
              Ver catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <QuoteButton variant="outline" size="lg" label="Solicitar cotización" />
          </div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 text-right hidden md:block">
          <p className="font-display text-4xl text-accent leading-none">{products.length || "40+"}</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mt-2">
            Equipos disponibles
          </p>
        </div>
      </section>

      {/* Tratamientos */}
      <section id="tratamientos" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
              Explora por necesidad clínica
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight max-w-xl">
              Tratamientos estéticos profesionales para tu clínica
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cada categoría incluye una guía clínica con criterios para elegir el equipo correcto para tu cartera.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TREATMENTS.map((t) => {
            const img = treatmentImage(t.slug);
            const count = treatmentCount(t.slug);
            return (
              <Link
                key={t.slug}
                to="/tratamiento/$slug"
                params={{ slug: t.slug }}
                className="group relative aspect-[5/6] overflow-hidden bg-primary"
              >
                {img && (
                  <img
                    src={img}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:opacity-80 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                    {count} {count === 1 ? "equipo" : "equipos"}
                  </p>
                  <h3 className="font-display text-2xl leading-tight mb-2">{t.name}</h3>
                  <p className="text-xs text-primary-foreground/70 leading-relaxed mb-4 line-clamp-2">
                    {t.short}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-accent">
                    Ver guía + equipos <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destacados */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
              Destacados
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight max-w-xl">
              Equipos de aparatología estética destacados
            </h2>
          </div>
          <Link
            to="/catalogo"
            search={{ sort: "newest" }}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
          >
            Ver catálogo completo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border">
            <p className="font-display text-2xl mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">
              Crea un producto contándole al chat qué quieres ofrecer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {featured.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
