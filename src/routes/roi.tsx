import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { TrendingUp, MessageCircle, ArrowRight, Calendar, DollarSign, Percent } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  PRODUCTS_QUERY,
  storefrontApiRequest,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { QUOTE_WHATSAPP } from "@/lib/quote";

const searchSchema = z.object({
  handle: z.string().optional(),
});

export const Route = createFileRoute("/roi")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Calculadora de ROI — DermaTek" },
      {
        name: "description",
        content:
          "Calcula el retorno de inversión de tu equipo de aparatología estética: ingreso anual, utilidad y mes de recuperación.",
      },
      { property: "og:title", content: "Calculadora de ROI — DermaTek" },
      {
        property: "og:description",
        content: "Proyecta ingresos, utilidad y punto de equilibrio de tu próxima inversión clínica.",
      },
    ],
  }),
  component: RoiPage,
});

const MXN = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0,
  );

function RoiPage() {
  const { handle } = Route.useSearch();

  const { data: products } = useQuery({
    queryKey: ["products-roi"],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50 });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  const [selectedHandle, setSelectedHandle] = useState<string | undefined>(handle);
  const selected = useMemo(
    () => products?.find((p) => p.node.handle === selectedHandle) ?? products?.[0],
    [products, selectedHandle],
  );

  const productPrice = selected
    ? parseFloat(selected.node.priceRange.minVariantPrice.amount) || 0
    : 0;

  // Inputs
  const [equipmentPrice, setEquipmentPrice] = useState<number>(0);
  const [sessionPrice, setSessionPrice] = useState<number>(2500);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(10);
  const [weeksActive, setWeeksActive] = useState<number>(48);
  const [variableCostPct, setVariableCostPct] = useState<number>(15);
  const [monthlyFixed, setMonthlyFixed] = useState<number>(0);

  // Sync precio cuando cambia producto seleccionado
  useEffect(() => {
    if (productPrice > 0) setEquipmentPrice(productPrice);
    else if (selected) setEquipmentPrice(150000);
  }, [productPrice, selected]);

  // Cálculos
  const sessionsYear = sessionsPerWeek * weeksActive;
  const grossYear = sessionsYear * sessionPrice;
  const variableCostYear = grossYear * (variableCostPct / 100);
  const fixedYear = monthlyFixed * 12;
  const netYear = grossYear - variableCostYear - fixedYear;
  const netMonth = netYear / 12;
  const paybackMonths = netMonth > 0 ? equipmentPrice / netMonth : Infinity;
  const roi12 = equipmentPrice > 0 ? ((netYear - equipmentPrice) / equipmentPrice) * 100 : 0;
  const roi24 = equipmentPrice > 0 ? ((netYear * 2 - equipmentPrice) / equipmentPrice) * 100 : 0;
  const roi36 = equipmentPrice > 0 ? ((netYear * 3 - equipmentPrice) / equipmentPrice) * 100 : 0;

  // WhatsApp message con proyección
  const waUrl = useMemo(() => {
    const lines = [
      "Hola DermaTek, hice una proyección de ROI y me interesa cotizar:",
      "",
      selected ? `Equipo: ${selected.node.title}` : "Equipo: por definir",
      `Inversión estimada: ${MXN(equipmentPrice)}`,
      `Precio por sesión: ${MXN(sessionPrice)}`,
      `Sesiones/semana: ${sessionsPerWeek} · ${weeksActive} semanas/año`,
      "",
      `Ingreso bruto anual estimado: ${MXN(grossYear)}`,
      `Utilidad neta anual estimada: ${MXN(netYear)}`,
      `Recuperación de inversión: ${isFinite(paybackMonths) ? `${paybackMonths.toFixed(1)} meses` : "—"}`,
      "",
      "Quedo atento(a) a propuesta formal y condiciones.",
    ].join("\n");
    return `https://wa.me/${QUOTE_WHATSAPP}?text=${encodeURIComponent(lines)}`;
  }, [selected, equipmentPrice, sessionPrice, sessionsPerWeek, weeksActive, grossYear, netYear, paybackMonths]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Herramienta financiera</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-3">
          Calculadora de ROI
        </h1>
        <p className="text-sm text-muted-foreground mb-12 max-w-xl">
          Proyecta ingreso anual, utilidad neta y mes de recuperación de tu próxima inversión en aparatología.
        </p>

        <div className="grid lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">
          {/* Inputs */}
          <div className="space-y-8">
            <Section title="01 / Equipo">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Selecciona un equipo
                </span>
                <select
                  value={selected?.node.handle ?? ""}
                  onChange={(e) => setSelectedHandle(e.target.value)}
                  className="mt-2 w-full h-12 px-4 bg-background border border-border focus:border-accent focus:outline-none text-sm"
                >
                  {!products && <option>Cargando…</option>}
                  {products?.map((p) => (
                    <option key={p.node.id} value={p.node.handle}>
                      {p.node.title}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Inversión (MXN)"
                value={equipmentPrice}
                onChange={setEquipmentPrice}
                step={1000}
              />
            </Section>

            <Section title="02 / Operación">
              <Field
                label="Precio por sesión (MXN)"
                value={sessionPrice}
                onChange={setSessionPrice}
                step={100}
              />
              <Slider
                label="Sesiones por semana"
                value={sessionsPerWeek}
                onChange={setSessionsPerWeek}
                min={1}
                max={60}
                suffix=" sesiones"
              />
              <Slider
                label="Semanas operativas al año"
                value={weeksActive}
                onChange={setWeeksActive}
                min={20}
                max={52}
                suffix=" sem"
              />
            </Section>

            <Section title="03 / Costos">
              <Slider
                label="Costo variable por sesión"
                value={variableCostPct}
                onChange={setVariableCostPct}
                min={0}
                max={60}
                suffix="%"
              />
              <Field
                label="Costo fijo mensual (MXN)"
                value={monthlyFixed}
                onChange={setMonthlyFixed}
                step={500}
              />
            </Section>
          </div>

          {/* Resultados */}
          <div className="space-y-8">
            {selected && (
              <div className="flex gap-4 p-4 border border-border bg-card">
                <div className="w-20 h-24 bg-muted overflow-hidden flex-shrink-0">
                  {selected.node.images.edges[0] && (
                    <img
                      src={selected.node.images.edges[0].node.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {selected.node.productType && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                      {selected.node.productType}
                    </p>
                  )}
                  <Link
                    to="/product/$handle"
                    params={{ handle: selected.node.handle }}
                    className="font-display text-lg leading-tight hover:text-accent block mb-1"
                  >
                    {selected.node.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Precio referencia:{" "}
                    {productPrice > 0
                      ? formatPrice(productPrice, selected.node.priceRange.minVariantPrice.currencyCode)
                      : "Cotizar"}
                  </p>
                </div>
              </div>
            )}

            {/* KPIs grandes */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Kpi
                icon={<DollarSign className="w-4 h-4" />}
                label="Ingreso bruto/año"
                value={MXN(grossYear)}
              />
              <Kpi
                icon={<TrendingUp className="w-4 h-4" />}
                label="Utilidad neta/año"
                value={MXN(netYear)}
                accent
              />
              <Kpi
                icon={<Calendar className="w-4 h-4" />}
                label="Recuperación"
                value={isFinite(paybackMonths) ? `${paybackMonths.toFixed(1)} meses` : "—"}
              />
            </div>

            {/* Desglose mensual */}
            <div className="border border-border">
              <div className="px-6 py-4 border-b border-border">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Desglose mensual estimado
                </p>
              </div>
              <div className="divide-y divide-border">
                <Line label="Sesiones / mes" value={`${(sessionsYear / 12).toFixed(0)}`} />
                <Line label="Ingreso bruto mensual" value={MXN(grossYear / 12)} />
                <Line
                  label={`Costo variable (${variableCostPct}%)`}
                  value={`− ${MXN(variableCostYear / 12)}`}
                  muted
                />
                <Line label="Costo fijo mensual" value={`− ${MXN(monthlyFixed)}`} muted />
                <Line label="Utilidad neta mensual" value={MXN(netMonth)} strong />
              </div>
            </div>

            {/* ROI por horizonte */}
            <div className="grid sm:grid-cols-3 gap-4">
              <RoiCard months={12} roi={roi12} />
              <RoiCard months={24} roi={roi24} />
              <RoiCard months={36} roi={roi36} />
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-primary text-primary-foreground">
              <div>
                <p className="font-display text-xl mb-1">¿Esta proyección hace sentido?</p>
                <p className="text-sm text-primary-foreground/70">
                  Te enviamos propuesta formal con financiamiento y capacitación incluidos.
                </p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-14 px-7 bg-accent text-accent-foreground hover:bg-accent/90 text-xs uppercase tracking-[0.2em] font-medium transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Solicitar propuesta
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Esta calculadora es una proyección estimada con fines informativos. Los resultados reales
              dependen de tu mercado, ticket promedio, ocupación clínica y costos operativos.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4 pb-2 border-b border-border">
        {title}
      </p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
        className="mt-2 w-full h-12 px-4 bg-background border border-border focus:border-accent focus:outline-none text-sm font-display tabular-nums"
      />
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <span className="font-display text-sm tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-accent"
      />
    </label>
  );
}

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 border ${
        accent ? "border-accent bg-accent/5" : "border-border bg-card"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-3 ${
          accent ? "text-accent" : "text-muted-foreground"
        }`}
      >
        {icon}
        {label}
      </div>
      <p className="font-display text-2xl tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function Line({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className={`text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? "font-display text-lg text-accent" : muted ? "text-sm text-muted-foreground" : "text-sm"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function RoiCard({ months, roi }: { months: number; roi: number }) {
  const positive = roi >= 0;
  return (
    <div className="p-5 border border-border">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
        <Percent className="w-3.5 h-3.5" />
        ROI a {months} meses
      </div>
      <p
        className={`font-display text-2xl tracking-tight tabular-nums ${
          positive ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {positive ? "+" : ""}
        {roi.toFixed(0)}%
      </p>
    </div>
  );
}