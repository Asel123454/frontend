"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { PlusCircle, Package, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string; slug: string; name: string; price: number; stock: number; isActive: boolean; images: string[];
}

export default function SellerProductsPage() {
  const t = useTranslations("seller");
  const { token, isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token || !user) return;
    fetchAPI<{ products: Product[] }>(`/api/products?seller=${user.id}&active=all`, { token })
      .then((data) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, user]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("myProducts")}</h1>
        <Link href="/seller/products/new"><Button className="gap-2"><PlusCircle className="w-4 h-4" />{t("addProduct")}</Button></Link>
      </div>
      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><Package className="w-6 h-6 text-muted-foreground" /></div>
                <div className="flex-1 min-w-0"><p className="font-semibold truncate">{p.name}</p><p className="text-sm text-muted-foreground">Stock: {p.stock}</p></div>
                <Badge variant={p.isActive ? "success" : "danger"}>{p.isActive ? "Active" : "Inactive"}</Badge>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-primary mr-4">{formatPrice(p.price)}</p>
                  <Link href={`/seller/products/edit/${p.slug}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={async () => {
                      if (confirm("Удалить товар?")) {
                        try {
                          await fetchAPI(`/api/products/${p.id}`, { method: "DELETE", token: token || undefined });
                          setProducts(products.filter(prod => prod.id !== p.id));
                        } catch (e) {
                          alert("Ошибка при удалении");
                        }
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardHeader><CardTitle className="text-center text-muted-foreground">No products yet</CardTitle></CardHeader></Card>
      )}
    </div>
  );
}
