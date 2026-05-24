"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const { items, totalPrice, clearCart, isHydrated } = useCart();
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isAuthenticated || !token) {
      router.push(`/${locale}/login`);
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const shippingAddress = formData.get("shippingAddress") as string;

    try {
      const result = await fetchAPI<{ orderId: string }>("/api/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          shippingAddress,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      setOrderId(result.orderId);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оформления");
      setLoading(false);
    }
  }

  if (orderId) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-in">
        <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("placeOrder")}!</h1>
        <p className="text-muted-foreground mb-6">
          {tc("orderNumber")}: <span className="font-mono font-bold">{orderId.slice(0, 8)}</span>
        </p>
        <Button onClick={() => router.push(`/${locale}/profile/orders`)} className="gap-2">
          <ShoppingBag className="w-4 h-4" /> {tc("myOrders")}
        </Button>
      </div>
    );
  }

  if (!isHydrated) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in">Загрузка...</div>;
  }

  if (items.length === 0) {
    router.push(`/${locale}/cart`);
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <form onSubmit={handleCheckout} className="space-y-6" id="checkout-form">
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">{t("shippingAddress")}</h3>
                <Input name="shippingAddress" label={t("shippingAddress")} placeholder="г. Бишкек, ул. Примерная, д. 1" required />
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full" isLoading={loading}>{t("placeOrder")}</Button>
          </form>
        </div>
        <div className="md:col-span-2">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">{t("orderSummary")}</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>{tc("total")}</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
