import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { TREATMENTS } from "@/lib/treatments";

export function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [openTreat, setOpenTreat] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/catalogo", search: { q: q.trim() || undefined, cat: undefined, sort: "newest" } });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl tracking-tight">
              Derma<span className="text-accent">Tek</span>
            </span>
          </Link>
          <form onSubmit={submit} className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar equipos, tecnologías, marcas…"
              className="w-full h-10 pl-11 pr-4 bg-muted/50 border border-border/60 rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:bg-background transition-colors"
            />
          </form>
          <Link
            to="/roi"
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden lg:inline">Calculadora ROI</span>
          </Link>
          <CartDrawer />
        </div>
        {/* Treatments nav */}
        <nav className="hidden md:flex items-center gap-8 h-11 border-t border-border/40 text-xs uppercase tracking-[0.18em]">
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setOpenTreat(true)}
            onMouseLeave={() => setOpenTreat(false)}
          >
            <button className="flex items-center gap-1.5 text-foreground hover:text-accent transition-colors">
              Tratamientos <ChevronDown className="w-3 h-3" />
            </button>
            {openTreat && (
              <div className="absolute top-full left-0 w-[640px] bg-background border border-border shadow-lg p-6 grid grid-cols-2 gap-4 z-50">
                {TREATMENTS.map((t) => (
                  <Link
                    key={t.slug}
                    to="/tratamiento/$slug"
                    params={{ slug: t.slug }}
                    onClick={() => setOpenTreat(false)}
                    className="group block p-3 hover:bg-muted transition-colors"
                  >
                    <p className="font-display text-base text-foreground group-hover:text-accent transition-colors normal-case tracking-normal mb-1">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground normal-case tracking-normal leading-snug">
                      {t.short}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/catalogo" search={{ sort: "newest" }} className="text-muted-foreground hover:text-foreground transition-colors">
            Catálogo completo
          </Link>
          <Link to="/roi" className="text-muted-foreground hover:text-foreground transition-colors">
            Calculadora ROI
          </Link>
        </nav>
      </div>
    </header>
  );
}