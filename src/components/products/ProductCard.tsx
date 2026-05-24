"use client";


import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  categoryName: string;
  stock: number;
  reviewCount?: number;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  categoryName,
  stock,
  reviewCount = 0,
}: ProductCardProps) {
  const t = useTranslations("common");
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      price,
      image: image ? getImageUrl(image) : "",
      stock,
    });
  };

  const imgSrc = image ? getImageUrl(image) : "";

  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="card-hover rounded-xl border border-border bg-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-accent">
              <span className="text-4xl">🌿</span>
            </div>
          )}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="danger">Нет в наличии</Badge>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge>{categoryName}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{reviewCount} отзывов</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="font-bold text-lg text-primary">
              {formatPrice(price)}
            </p>
            {stock > 0 && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="gap-1"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("addToCart")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
