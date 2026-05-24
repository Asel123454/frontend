import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { fetchAPI } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";


interface CategoryItem {
  id: string; slug: string; name: string; description: string; productCount: number;
}

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await fetchAPI<CategoryItem[]>(`/api/categories?locale=${locale}`);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{t("categories")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <Card className="card-hover h-full group cursor-pointer">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{category.productCount} {t("products").toLowerCase()}</span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {categories.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📂</span>
          <p className="text-lg text-muted-foreground">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
