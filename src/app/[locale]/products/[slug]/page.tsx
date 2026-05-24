import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductDetail {
  id: string; slug: string; name: string; description: string;
  price: number; stock: number; images: string[]; categoryName: string;
  seller: { id: string; name: string | null; avatar: string | null };
  reviews: Array<{ id: string; rating: number; comment: string | null; user: { id: string; name: string | null; avatar: string | null }; createdAt: string }>;
  avgRating: number;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  try {
    const product = await fetchAPI<ProductDetail>(`/api/products/${slug}?locale=${locale}`);
    return {
      title: `${product.name} | Craft & Organic KG`,
      description: product.description || `Buy ${product.name} from Craft & Organic KG`,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const product = await fetchAPI<ProductDetail>(`/api/products/${slug}?locale=${locale}`);
    return <ProductDetailClient product={product} />;
  } catch {
    notFound();
  }
}
