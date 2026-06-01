import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ArrowLeft, Loader2, Plus, Check, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuoteButton } from "@/components/QuoteButton";
import { useCartSync } from "@/hooks/useCartSync";
import {
  PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { treatmentsForProduct } from "@/lib/treatments";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

function ProductPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      return res?.data?.product as ShopifyProduct["node"] | null;
    },
  });

  const product = data;
  const variant = product?.variants.edges[0]?.node;
  const images = product?.images.edges ?? [];
  const productAsNode: ShopifyProduct | null = useMemo(
    () => (product ? ({ node: product } as ShopifyProduct) : null),
    [product],
  );
  const treatments = productAsNode ? treatmentsForProduct(productAsNode) : [];

  const handleAdd = async () => {
    if (!variant || !productAsNode) return;
    await addItem({
      product: productAsNode,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Catálogo
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : !product ? (
          <div className="text-center py-32">
            <p className="font-display text-2xl">Producto no encontrado</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                {images[imgIdx] ? (
                  <img
                    src={images[imgIdx].node.url}
                    alt={images[imgIdx].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
                    Sin imagen
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img.node.url}
                      onClick={() => setImgIdx(i)}
                      className={`aspect-square bg-muted overflow-hidden border-2 transition-colors ${
                        i === imgIdx ? "border-accent" : "border-transparent"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-4">
              {product.productType && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                  {product.productType}
                </p>
              )}
              <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                {product.title}
              </h1>
              <p className="font-display text-3xl text-foreground mb-8">
                {parseFloat(product.priceRange.minVariantPrice.amount) > 0
                  ? formatPrice(
                      product.priceRange.minVariantPrice.amount,
                      product.priceRange.minVariantPrice.currencyCode,
                    )
                  : "Cotizar"}
              </p>

              {product.description && (
                <p className="text-base text-foreground/80 leading-relaxed mb-10 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <button
                onClick={handleAdd}
                disabled={isLoading || !variant?.availableForSale}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] font-medium mb-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : variant?.availableForSale ? (
                  <>
                    <Plus className="w-4 h-4" />
                    Agregar al carrito
                  </>
                ) : (
                  "Agotado"
                )}
              </button>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {productAsNode && (
                  <QuoteButton products={[productAsNode]} variant="primary" size="md" label="Cotizar" />
                )}
                <Link
                  to="/roi"
                  search={{ handle: product.handle }}
                  className="h-11 inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors border border-foreground/20 hover:border-accent hover:text-accent"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Calcular ROI
                </Link>
              </div>

              {treatments.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {treatments.map((t) => (
                    <Link
                      key={t.slug}
                      to="/tratamiento/$slug"
                      params={{ slug: t.slug }}
                      className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="space-y-3 pt-8 border-t border-border mt-8 text-sm text-muted-foreground">
                {[
                  "Envío especializado a toda la república",
                  "Capacitación técnica incluida",
                  "Garantía y soporte post-venta",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}