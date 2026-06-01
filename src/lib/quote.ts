import type { ShopifyProduct } from "@/lib/shopify";

// Cambia este número por el WhatsApp comercial de DermaTek (formato internacional sin +)
export const QUOTE_WHATSAPP = "525568552672";
export const QUOTE_EMAIL = "ventas@dermatek.mx";

export function buildQuoteMessage(products: ShopifyProduct[]): string {
  if (products.length === 0) {
    return "Hola DermaTek, me gustaría recibir información y cotización de sus equipos.";
  }
  const lines = products.map((p, i) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/product/${p.node.handle}`;
    return `${i + 1}. ${p.node.title}${p.node.productType ? ` (${p.node.productType})` : ""} — ${url}`;
  });
  return [
    "Hola DermaTek, me interesa recibir cotización formal de los siguientes equipos:",
    "",
    ...lines,
    "",
    "Quedo atento(a) a precios, disponibilidad y condiciones de envío.",
  ].join("\n");
}

export function whatsappQuoteUrl(products: ShopifyProduct[] = []): string {
  const text = encodeURIComponent(buildQuoteMessage(products));
  return `https://wa.me/${QUOTE_WHATSAPP}?text=${text}`;
}