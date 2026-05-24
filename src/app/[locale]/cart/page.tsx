"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in">
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("empty")}</h2>
          <p className="text-muted-foreground mb-6">Добавьте товары в корзину, чтобы продолжить</p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              {t("continueShopping")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{t("title")} ({totalItems})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">🌿</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 hover:bg-muted transition-colors rounded-l-lg">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-muted transition-colors rounded-r-lg">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">{t("orderSummary")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span className="text-green-600">{t("free")}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{tc("total")}</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full gap-2">{t("checkout")} <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link href="/products" className="block">
                <Button variant="ghost" className="w-full text-sm">{t("continueShopping")}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
