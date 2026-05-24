"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI, uploadFiles } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function EditProductPage() {
  const t = useTranslations("seller");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetchAPI(`/api/categories?locale=${locale}`),
      fetchAPI(`/api/products/${slug}?locale=${locale}`)
    ])
      .then(([cats, prod]) => {
        setCategories(cats as any);
        setProduct(prod);
        if ((prod as any).images) {
          setImages((prod as any).images);
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setFetching(false);
      });
  }, [locale, slug]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length || !token) return;
    setUploading(true);
    try {
      const data = await uploadFiles(Array.from(files), token);
      if (data.urls) setImages((prev) => [...prev, ...data.urls]);
    } catch { setError("Failed to upload images"); }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!token || !product) { setError("Not authenticated"); setLoading(false); return; }

    const fd = new FormData(e.currentTarget);
    const body = {
      price: parseFloat(fd.get("price") as string),
      stock: parseInt(fd.get("stock") as string),
      categoryId: fd.get("categoryId") as string,
      images,
      translations: {
        ru: { name: fd.get("name_ru") as string, description: fd.get("desc_ru") as string },
        en: { name: (fd.get("name_en") as string) || (fd.get("name_ru") as string), description: fd.get("desc_en") as string },
        kg: { name: (fd.get("name_kg") as string) || (fd.get("name_ru") as string), description: fd.get("desc_kg") as string },
      },
    };

    try {
      await fetchAPI(`/api/products/${product.id}`, { method: "PUT", token, body: JSON.stringify(body) });
      router.push(`/${locale}/seller/products`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  function getTranslation(loc: string, field: "name" | "description") {
    if (!product || !product.allTranslations) return "";
    const t = product.allTranslations.find((x: any) => x.locale === loc);
    return t ? t[field] : "";
  }

  if (fetching) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center text-destructive">Product not found</div>;

  // Prevent users from editing other people's products
  if (product.seller.id !== user?.id) {
    return <div className="p-8 text-center text-destructive">Unauthorized</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <Link href="/seller/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Link>
      <h1 className="text-3xl font-bold mb-8">Редактировать товар</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <Card>
          <CardHeader><CardTitle>Фотографии</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${img}`} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">{uploading ? "..." : "Фото"}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Название и описание</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇷🇺 Перевод (Русский)</p><Input name="name_ru" label="Название" required defaultValue={getTranslation("ru", "name")} /><div className="space-y-1.5"><label className="block text-sm font-medium">Описание</label><textarea name="desc_ru" defaultValue={getTranslation("ru", "description")} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇬🇧 Перевод (English)</p><Input name="name_en" label="Name" defaultValue={getTranslation("en", "name")} /><div className="space-y-1.5"><label className="block text-sm font-medium">Description</label><textarea name="desc_en" defaultValue={getTranslation("en", "description")} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇰🇬 Перевод (Кыргызча)</p><Input name="name_kg" label="Аталышы" defaultValue={getTranslation("kg", "name")} /><div className="space-y-1.5"><label className="block text-sm font-medium">Сүрөттөмө</label><textarea name="desc_kg" defaultValue={getTranslation("kg", "description")} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Цена и наличие</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="price" type="number" step="0.01" label="Цена (сом)" required defaultValue={product.price} />
              <Input name="stock" type="number" label="Количество" required defaultValue={product.stock} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Категория</label>
              <select
                name="categoryId"
                required
                defaultValue={product.categoryId}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Выберите категорию...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
        <Button type="submit" size="lg" className="w-full" isLoading={loading}>Сохранить изменения</Button>
      </form>
    </div>
  );
}
