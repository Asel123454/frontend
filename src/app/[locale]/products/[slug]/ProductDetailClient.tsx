"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";
import { ShoppingCart, Star, Minus, Plus, Package, User } from "lucide-react";

interface ProductDetailProps {
  product: {
    id: string; slug: string; name: string; description: string;
    price: number; stock: number; images: string[]; categoryName: string;
    seller: { id: string; name: string | null; avatar: string | null };
    reviews: Array<{ id: string; rating: number; comment: string | null; user: { id: string; name: string | null; avatar: string | null }; createdAt: string }>;
    avgRating: number;
  };
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] ? getImageUrl(product.images[0]) : "",
        stock: product.stock,
      });
    }
  };

  const currentImage = product.images[selectedImage] ? getImageUrl(product.images[selectedImage]) : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {currentImage ? (
              <Image src={currentImage} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-accent">
                <span className="text-8xl">🌿</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                  <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-3">{product.categoryName}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews.length} {t("reviews")})</span>
            </div>
          </div>

          <div className="text-4xl font-bold text-primary">{formatPrice(product.price)}</div>

          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            {product.stock > 0 ? (
              <Badge variant="success">{t("inStock")} ({product.stock})</Badge>
            ) : (
              <Badge variant="danger">{t("outOfStock")}</Badge>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">{t("details")}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("seller")}</p>
              <p className="font-medium text-sm">{product.seller.name || "Unknown"}</p>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted transition-colors rounded-l-lg">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-muted transition-colors rounded-r-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                {tc("addToCart")}
              </Button>
            </div>
          )}

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="font-semibold mb-4">{t("reviews")}</h3>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{review.user.name}</span>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
