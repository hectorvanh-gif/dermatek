import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, prepareCheckout, syncCart } =
    useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "MXN";

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const handleCheckout = async () => {
    const url = await prepareCheckout();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-foreground/5">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-medium bg-accent text-accent-foreground border-0">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0 border-b border-border/60 pb-4">
          <SheetTitle className="font-display text-2xl">Tu selección</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {totalItems === 0
              ? "Carrito vacío"
              : `${totalItems} ${totalItems === 1 ? "equipo" : "equipos"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-border flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="font-display text-xl mb-2">Aún no hay equipos</p>
                <p className="text-sm text-muted-foreground">
                  Explora nuestro catálogo de aparatología estética premium.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pb-5 border-b border-border/50 last:border-0">
                      <div className="w-20 h-20 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="font-display text-base leading-tight truncate">
                          {item.product.node.title}
                        </h4>
                        {item.selectedOptions.length > 0 && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.selectedOptions.map((o) => o.value).join(" · ")}
                          </p>
                        )}
                        <p className="mt-auto text-sm font-medium text-accent">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center border border-border rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-5 border-t border-border bg-background">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl">{formatPrice(totalPrice, currency)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-[0.25em] font-medium"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Pagar
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">
                  Pago seguro via Shopify
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}