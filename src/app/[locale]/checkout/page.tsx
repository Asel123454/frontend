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
import { CheckCircle, ShoppingBag, CreditCard, Lock, Wifi } from "lucide-react";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function detectCardType(number: string): "visa" | "mastercard" | "other" {
  const raw = number.replace(/\s/g, "");
  if (raw.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) return "mastercard";
  return "other";
}

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

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);

  const cardType = detectCardType(cardNumber);

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

  const displayNumber = cardNumber || "0000 0000 0000 0000";
  const displayHolder = cardHolder || t("cardHolderPlaceholder");
  const displayExpiry = expiry || t("expiryPlaceholder");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <form onSubmit={handleCheckout} className="space-y-6" id="checkout-form">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}

            {/* Shipping address */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">{t("shippingAddress")}</h3>
                <Input
                  name="shippingAddress"
                  label={t("shippingAddress")}
                  placeholder="г. Бишкек, ул. Примерная, д. 1"
                  required
                />
              </CardContent>
            </Card>

            {/* Payment card */}
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{t("payment")}</h3>
                  <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </div>

                {/* Visual card preview */}
                <div className="relative w-full" style={{ perspective: "1000px" }}>
                  <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: cvvFocused ? "rotateY(180deg)" : "rotateY(0deg)",
                      height: "180px",
                    }}
                  >
                    {/* Card front */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <Wifi className="w-6 h-6 text-white/80 rotate-90" />
                          {cardType === "visa" && (
                            <span className="text-white font-bold text-xl italic tracking-wider">VISA</span>
                          )}
                          {cardType === "mastercard" && (
                            <div className="flex">
                              <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                              <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3" />
                            </div>
                          )}
                          {cardType === "other" && (
                            <div className="flex">
                              <div className="w-7 h-7 rounded-full bg-white/30" />
                              <div className="w-7 h-7 rounded-full bg-white/20 -ml-3" />
                            </div>
                          )}
                        </div>
                        {/* Chip */}
                        <div className="w-10 h-7 rounded bg-yellow-300/80 flex items-center justify-center">
                          <div className="w-8 h-5 rounded border border-yellow-500/50 grid grid-cols-3 gap-0.5 p-0.5">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="bg-yellow-500/40 rounded-sm" />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-mono text-white text-lg tracking-[0.2em] drop-shadow">
                            {displayNumber.padEnd(19, "·")}
                          </p>
                          <div className="flex items-end justify-between mt-2">
                            <div>
                              <p className="text-white/60 text-[10px] uppercase tracking-widest">Card Holder</p>
                              <p className="text-white text-sm font-medium tracking-wide truncate max-w-[160px] uppercase">
                                {displayHolder}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/60 text-[10px] uppercase tracking-widest">Expires</p>
                              <p className="text-white text-sm font-medium">{displayExpiry}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card back */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 flex flex-col">
                        <div className="w-full h-10 bg-slate-900 mt-5" />
                        <div className="px-5 mt-4">
                          <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">CVV</p>
                          <div className="w-full h-10 bg-white/90 rounded flex items-center justify-end px-4">
                            <span className="font-mono text-slate-800 text-lg tracking-[0.3em]">
                              {cvv ? cvv.replace(/./g, "•") : "•••"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end px-5 pb-4">
                          <p className="text-white/30 text-[9px]">This is a mock payment card for demo purposes only.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("cardNumber")}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder={t("cardNumberPlaceholder")}
                      maxLength={19}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono tracking-wider transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("cardHolder")}
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder={t("cardHolderPlaceholder")}
                      maxLength={26}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm uppercase tracking-wide transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("expiry")}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder={t("expiryPlaceholder")}
                        maxLength={5}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono tracking-wider transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t("cvv")}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => setCvvFocused(false)}
                        placeholder={t("cvvPlaceholder")}
                        maxLength={4}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono tracking-wider transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  {t("mockPaymentNote")}
                </p>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              {t("placeOrder")}
            </Button>
          </form>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">{t("orderSummary")}</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
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
