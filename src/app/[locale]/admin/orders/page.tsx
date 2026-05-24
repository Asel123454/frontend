"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning", CONFIRMED: "default", SHIPPED: "default", DELIVERED: "success", CANCELLED: "danger",
};

interface AdminOrder {
  id: string; status: string; total: string; createdAt: string;
  buyer: { name: string; email: string };
}

export default function AdminOrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchAPI<AdminOrder[]>("/api/orders", { token }).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">Все заказы ({orders.length})</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardContent className="p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0"><p className="font-medium">#{o.id.slice(0, 8)}</p><p className="text-xs text-muted-foreground">{o.buyer.name} — {o.buyer.email}</p></div>
              <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
              <p className="font-bold text-primary">{formatPrice(Number(o.total))}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</p>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-12">Нет заказов</p>}
      </div>
    </div>
  );
}
