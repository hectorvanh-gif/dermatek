import { MessageCircle } from "lucide-react";
import { whatsappQuoteUrl } from "@/lib/quote";
import type { ShopifyProduct } from "@/lib/shopify";

interface Props {
  products?: ShopifyProduct[];
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function QuoteButton({ products = [], variant = "outline", size = "md", label = "Solicitar cotización", className = "" }: Props) {
  const sizeCls =
    size === "lg" ? "h-14 px-7 text-xs" : size === "sm" ? "h-9 px-4 text-[10px]" : "h-11 px-5 text-[11px]";
  const variantCls =
    variant === "primary"
      ? "bg-accent text-accent-foreground hover:bg-accent/90"
      : variant === "ghost"
        ? "text-foreground hover:text-accent"
        : "border border-foreground/20 hover:border-accent hover:text-accent";
  return (
    <a
      href={whatsappQuoteUrl(products)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-medium transition-colors ${sizeCls} ${variantCls} ${className}`}
    >
      <MessageCircle className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}