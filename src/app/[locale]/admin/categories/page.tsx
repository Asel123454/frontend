"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";

interface CategoryItem {
  id: string; slug: string; name: string; productCount: number;
}

export default function AdminCategoriesPage() {
  const { token, isAuthenticated } = useAuth();
  const params = useParams();
  const locale = params.locale as string;
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchAPI<CategoryItem[]>(`/api/categories?locale=${locale}`, { token })
      .then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, token, locale]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">Категории ({categories.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id} className="card-hover">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-1">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{c.productCount} товаров</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">{c.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {categories.length === 0 && <p className="text-center text-muted-foreground py-12">Нет категорий</p>}
    </div>
  );
}
