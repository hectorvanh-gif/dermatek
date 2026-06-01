import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, Check, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { QuoteButton } from "@/components/QuoteButton";
import { useCartSync } from "@/hooks/useCartSync";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { getTreatment, productsForTreatment, TREATMENTS } from "@/lib/treatments";

export const Route = createFileRoute("/tratamiento/$slug")({
  beforeLoad: ({ params }) => {
    if (!getTreatment(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const t = getTreatment(params.slug);
    const name = t?.name ?? "Tratamiento";
    const url = `https://friendly-shopify.lovable.app/tratamiento/${params.slug}`;
    return {
      meta: [
        { title: `${name} | Equipos Profesionales de Aparatología Estética | DermaTek` },
        { name: "description", content: `Equipos profesionales de ${name.toLowerCase()} para clínicas estéticas. ${t?.short ?? "Guía clínica, comparativa y asesoría experta DermaTek."}` },
        { property: "og:title", content: `${name} | Aparatología Estética Profesional | DermaTek` },
        { property: "og:description", content: `Guía clínica y equipos profesionales de ${name.toLowerCase()} para clínicas. Asesoría experta DermaTek.` },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: url },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="font-display text-3xl mb-4">Tratamiento no encontrado</p>
        <Link to="/" className="text-accent underline">Volver al inicio</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="font-display text-2xl">Error: {error.message}</p>
    </div>
  ),
  component: TratamientoPage,
});

function TratamientoPage() {
  useCartSync();
  const { slug } = Route.useParams();
  const treatment = getTreatment(slug)!;

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100, query: null });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  const products = productsForTreatment(data ?? [], slug);
  const otros = TREATMENTS.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Breadcrumb + Hero */}
      <section className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <nav className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8 flex gap-2">
            <Link to="/" className="hover:text-accent">Inicio</Link>
            <span>/</span>
            <span className="text-accent">Tratamiento</span>
          </nav>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 rounded-full mb-6">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium">
                  Guía clínica
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
                {treatment.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {treatment.hero}
              </p>
            </div>
            <div className="lg:col-span-4 text-right">
              <p className="font-display text-5xl text-accent">{products.length}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
                Equipos en esta categoría
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guía clínica */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">¿Qué incluye?</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
            Guía clínica de {treatment.name.toLowerCase()} para profesionales
          </h2>
          <p className="text-base text-foreground/80 leading-relaxed">{treatment.guide.intro}</p>
        </div>
        <div className="lg:col-span-7 space-y-5">
          {treatment.guide.bullets.map((b) => (
            <div key={b.title} className="p-6 border border-border bg-card">
              <h3 className="font-display text-xl mb-2">{b.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo elegir */}
      <section className="bg-card border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Decisión de compra</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-10">
            Cómo elegir tu equipo de {treatment.name.toLowerCase()}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {treatment.guide.howToChoose.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <Check className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                <p className="text-sm text-foreground/80 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
              Equipos disponibles
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Equipos profesionales de {treatment.name.toLowerCase()}
            </h2>
          </div>
          <QuoteButton variant="outline" size="md" label="Asesoría experta" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <p className="font-display text-2xl mb-2">Pronto disponible</p>
            <p className="text-sm text-muted-foreground mb-6">
              Aún no hay equipos cargados en esta categoría. Contáctanos por una recomendación.
            </p>
            <QuoteButton variant="primary" size="md" label="Hablar con un asesor" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Otros tratamientos */}
      <section className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Explora también</p>
          <h2 className="font-display text-3xl tracking-tight mb-10">Otros tratamientos estéticos profesionales</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otros.map((t) => (
              <Link
                key={t.slug}
                to="/tratamiento/$slug"
                params={{ slug: t.slug }}
                className="group p-6 border border-border bg-card hover:border-accent hover:bg-background transition-colors"
              >
                <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.short}</p>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-accent">
                  Ver guía <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}