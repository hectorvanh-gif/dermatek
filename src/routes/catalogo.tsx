import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { useCartSync } from "@/hooks/useCartSync";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

type SortKey = "newest" | "price-asc" | "price-desc" | "title";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  sort: fallback(z.enum(["newest", "price-asc", "price-desc", "title"]), "newest").default("newest"),
});

type CatalogoSearch = { q?: string; cat?: string; sort: SortKey };

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Catálogo de Aparatología Estética Profesional | DermaTek" },
      { name: "description", content: "Catálogo DermaTek: equipos de depilación láser, HIFU, hidrafacial, radiofrecuencia y EMSzero. Más de 40 equipos profesionales para clínicas estéticas." },
      { property: "og:title", content: "Catálogo de Aparatología Estética Profesional | DermaTek" },
      { property: "og:description", content: "Más de 40 equipos profesionales de depilación y aparatología estética para clínicas y spas." },
      { property: "og:url", content: "https://friendly-shopify.lovable.app/catalogo" },
    ],
    links: [
      { rel: "canonical", href: "https://friendly-shopify.lovable.app/catalogo" },
    ],
  }),
  component: CatalogoPage,
});

function CatalogoPage() {
  useCartSync();
  const { q, cat, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100, query: null });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  const all = data ?? [];

  const categories = useMemo(() => {
    // Group by Shopify Collections (handle → { title, count })
    const map = new Map<string, { title: string; count: number }>();
    for (const p of all) {
      const cols = p.node.collections?.edges ?? [];
      for (const c of cols) {
        const cur = map.get(c.node.handle);
        if (cur) cur.count += 1;
        else map.set(c.node.handle, { title: c.node.title, count: 1 });
      }
    }
    return Array.from(map.entries())
      .map(([handle, v]) => ({ handle, title: v.title, count: v.count }))
      .sort((a, b) => b.count - a.count);
  }, [all]);

  const filtered = useMemo(() => {
    let list = all;
    if (cat) {
      list = list.filter((p) =>
        (p.node.collections?.edges ?? []).some((c) => c.node.handle === cat),
      );
    }
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.node.title.toLowerCase().includes(needle) ||
          p.node.description?.toLowerCase().includes(needle) ||
          p.node.vendor?.toLowerCase().includes(needle) ||
          p.node.productType?.toLowerCase().includes(needle),
      );
    }
    const sorted = [...list];
    const price = (p: ShopifyProduct) => parseFloat(p.node.priceRange.minVariantPrice.amount) || 0;
    if (sort === "price-asc") sorted.sort((a, b) => price(a) - price(b));
    else if (sort === "price-desc") sorted.sort((a, b) => price(b) - price(a));
    else if (sort === "title") sorted.sort((a, b) => a.node.title.localeCompare(b.node.title));
    return sorted;
  }, [all, cat, q, sort]);

  const setCat = (next: string | undefined) =>
    navigate({ search: (prev: CatalogoSearch) => ({ ...prev, cat: next }) });

  const catTitle = cat ? categories.find((c) => c.handle === cat)?.title ?? cat : undefined;
  const activeFilters = [q && { key: "q", label: `“${q}”` }, cat && { key: "cat", label: catTitle ?? cat }].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Catálogo</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          {catTitle ?? "Catálogo de aparatología estética profesional"}
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          {isLoading ? "Cargando…" : `${filtered.length} ${filtered.length === 1 ? "equipo" : "equipos"} disponibles`}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-24 self-start space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
              <h2 className="text-[10px] uppercase tracking-[0.25em] font-medium">Filtros</h2>
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={() => navigate({ search: { sort: "newest", cat: undefined, q: undefined } })}
                className="text-xs text-muted-foreground hover:text-accent underline underline-offset-4 mb-6"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Categoría
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCat(undefined)}
                  className={`text-left transition-colors hover:text-accent ${!cat ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  Todos <span className="text-muted-foreground/60">({all.length})</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.handle}>
                  <button
                    onClick={() => setCat(c.handle)}
                    className={`text-left transition-colors hover:text-accent ${cat === c.handle ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {c.title} <span className="text-muted-foreground/60">({c.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Active chips + sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
            <div className="flex flex-wrap gap-2">
              {activeFilters.length === 0 ? (
                <span className="text-xs text-muted-foreground">Sin filtros aplicados</span>
              ) : (
                activeFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => navigate({ search: (prev: CatalogoSearch) => ({ ...prev, [f.key]: undefined }) })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {f.label}
                    <X className="w-3 h-3" />
                  </button>
                ))
              )}
            </div>
            <label className="flex items-center gap-3 text-xs">
              <span className="uppercase tracking-[0.2em] text-muted-foreground">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => navigate({ search: (prev: CatalogoSearch) => ({ ...prev, sort: e.target.value as SortKey }) })}
                className="bg-transparent border-b border-border py-1 pr-6 focus:outline-none focus:border-accent text-sm"
              >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="title">Nombre A–Z</option>
              </select>
            </label>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden mb-6 -mx-6 px-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setCat(undefined)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border ${!cat ? "border-accent text-foreground" : "border-border text-muted-foreground"}`}
              >
                Todos
              </button>
              {categories.map((c) => (
                <button
                  key={c.handle}
                  onClick={() => setCat(c.handle)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border whitespace-nowrap ${cat === c.handle ? "border-accent text-foreground" : "border-border text-muted-foreground"}`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-border">
              <p className="font-display text-2xl mb-2">Sin resultados</p>
              <p className="text-sm text-muted-foreground mb-6">
                Prueba con otros filtros o explora todo el catálogo.
              </p>
              <Link
                to="/catalogo"
                search={{ sort: "newest", cat: undefined, q: undefined }}
                className="inline-flex items-center h-11 px-6 border border-foreground/20 hover:border-foreground text-xs uppercase tracking-[0.25em]"
              >
                Ver todo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {filtered.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}