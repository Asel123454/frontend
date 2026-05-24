"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { Users, Package, ShoppingBag, Layers, ArrowRight } from "lucide-react";

interface AdminOrder {
  id: string; total: string; createdAt: string;
  buyer: { name: string; email: string };
}

export default function AdminPage() {
  const t = useTranslations("admin");
  const { token, isAuthenticated } = useAuth();
  const [usersCount, setUsersCount] = useState(0);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    Promise.all([
      fetchAPI<Array<{ id: string }>>("/api/users", { token }),
      fetchAPI<AdminOrder[]>("/api/orders", { token }),
    ]).then(([users, ords]) => {
      setUsersCount(users.length);
      setOrders(ords);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading...</div>;

  const stats = [
    { label: t("users"), value: usersCount, icon: Users, color: "blue", href: "/admin/users" },
    { label: t("allOrders"), value: orders.length, icon: ShoppingBag, color: "green", href: "/admin/orders" },
    { label: t("categories"), value: "—", icon: Layers, color: "purple", href: "/admin/categories" },
    { label: t("allProducts"), value: "—", icon: Package, color: "amber", href: "/admin/products" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{t("dashboard")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="card-hover group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">Последние заказы</h3>
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-sm">#{o.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{o.buyer.name} — {o.buyer.email}</p>
              </div>
              <span className="text-sm font-bold">{Number(o.total).toFixed(0)} сом</span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-muted-foreground py-4">Нет заказов</p>}
        </CardContent>
      </Card>
    </div>
  );
}
