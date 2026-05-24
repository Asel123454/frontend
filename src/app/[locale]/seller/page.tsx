"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, PlusCircle, TrendingUp } from "lucide-react";

interface SellerProduct {
  id: string; name: string; price: number; stock: number; images: string[];
}

interface SellerOrder {
  id: string;
  items: Array<{ price: string; quantity: number }>;
}

export default function SellerDashboardPage() {
  const t = useTranslations("seller");
  const { token, isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token || !user) return;
    Promise.all([
      fetchAPI<{ products: SellerProduct[]; total: number }>(`/api/products?seller=${user.id}&active=true&limit=5`, { token }),
      fetchAPI<SellerOrder[]>("/api/orders/seller", { token }),
    ]).then(([prodData, orderData]) => {
      setProducts(prodData.products);
      setProductCount(prodData.total);
      setOrders(orderData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, token, user]);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0), 0
  );

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <Link href="/seller/products/new">
          <Button className="gap-2"><PlusCircle className="w-4 h-4" />{t("addProduct")}</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link href="/seller/products" className="block">
          <Card className="card-hover h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Package className="w-6 h-6 text-blue-600" /></div>
              <div><p className="text-2xl font-bold">{productCount}</p><p className="text-sm text-muted-foreground">{t("totalProducts")}</p></div>
            </CardContent>
          </Card>
        </Link>
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{orders.length}</p><p className="text-sm text-muted-foreground">{t("totalOrders")}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center"><DollarSign className="w-6 h-6 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p><p className="text-sm text-muted-foreground">{t("revenue")}</p></div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />{t("myProducts")}</CardTitle>
            <Link href="/seller/products"><Button variant="ghost" size="sm">Все</Button></Link>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-muted-foreground">Остаток: {p.stock}</p></div>
                  <p className="font-bold text-primary">{formatPrice(p.price)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Нет товаров</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
