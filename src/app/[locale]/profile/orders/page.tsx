"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning", CONFIRMED: "default", SHIPPED: "default", DELIVERED: "success", CANCELLED: "danger",
};

interface OrderItem {
  id: string; quantity: number; price: string;
  product: { translations: Array<{ name: string }> };
}

interface Order {
  id: string; status: string; total: string; createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const tc = useTranslations("common");
  const tOrder = useTranslations("order");
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAPI<Order[]>("/api/orders/my", { token })
        .then(setOrders)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{tc("myOrders")}</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant[order.status]}>{tOrder(`status.${order.status}`)}</Badge>
                    <span className="font-bold text-primary">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1.5 border-t border-border first:border-0">
                      <span className="text-muted-foreground">{item.product.translations[0]?.name || "Product"} × {item.quantity}</span>
                      <span>{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">У вас пока нет заказов</p>
        </div>
      )}
    </div>
  );
}
