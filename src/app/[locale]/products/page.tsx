import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { fetchAPI } from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface ProductItem {
  id: string; slug: string; name: string; price: number;
  images: string[]; categoryName: string; stock: number;
  reviewCount: number;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return { title: `${t("products")} | Craft & Organic KG` };
}

export default async function ProductsPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const page = parseInt(sp.page || "1");

  const data = await fetchAPI<{ products: ProductItem[]; pages: number }>(
    `/api/products?locale=${locale}&page=${page}${sp.category ? `&category=${sp.category}` : ""}${sp.search ? `&search=${sp.search}` : ""}`
  );

  const categories = await fetchAPI<Array<{ id: string; name: string }>>(
    `/api/categories?locale=${locale}`
  );

  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t("products")}</h1>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !sp.category
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          {t("all")}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              sp.category === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      {data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.images[0] || ""}
                categoryName={product.categoryName}
                stock={product.stock}
                reviewCount={product.reviewCount}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/products?page=${p}${sp.category ? `&category=${sp.category}` : ""}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-accent"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-lg text-muted-foreground">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
