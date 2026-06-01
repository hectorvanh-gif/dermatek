import { Link } from "@tanstack/react-router";
import { Loader2, Plus, TrendingUp } from "lucide-react";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  const hasPrice = parseFloat(price.amount) > 0;

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-muted overflow-hidden mb-5">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
            Sin imagen
          </div>
        )}
        <Link
          to="/roi"
          search={{ handle: product.node.handle }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 left-3 h-9 px-3 text-[10px] uppercase tracking-[0.15em] backdrop-blur transition-all flex items-center gap-1.5 bg-background/90 text-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
          aria-label="Calcular ROI"
        >
          <TrendingUp className="w-3 h-3" />
          Calcular ROI
        </Link>
        <button
          onClick={handleAdd}
          disabled={isLoading || !variant?.availableForSale}
          className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-background/95 backdrop-blur text-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-accent-foreground shadow-md"
          aria-label="Agregar al carrito"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
      <div className="space-y-1">
        {product.node.productType && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.node.productType.replace("Equipo de Aparatología Estética", "Equipo")}
          </p>
        )}
        <h3 className="font-display text-lg leading-snug group-hover:text-accent transition-colors">
          {product.node.title}
        </h3>
        <p className="text-sm text-foreground/80 pt-1">
          {hasPrice ? formatPrice(price.amount, price.currencyCode) : "Cotizar"}
        </p>
      </div>
    </Link>
  );
}