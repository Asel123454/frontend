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

export default function NewProductPage() {
  const t = useTranslations("seller");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetchAPI(`/api/categories?locale=${locale}`)
      .then((data: any) => setCategories(data))
      .catch(console.error);
  }, [locale]);

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
    if (!token) { setError("Not authenticated"); setLoading(false); return; }

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
      await fetchAPI("/api/products", { method: "POST", token, body: JSON.stringify(body) });
      router.push(`/${locale}/seller`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <Link href="/seller" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Link>
      <h1 className="text-3xl font-bold mb-8">{t("addProduct")}</h1>
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
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇷🇺 Перевод (Русский)</p><Input name="name_ru" label="Название" required /><div className="space-y-1.5"><label className="block text-sm font-medium">Описание</label><textarea name="desc_ru" className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇬🇧 Перевод (English)</p><Input name="name_en" label="Name" /><div className="space-y-1.5"><label className="block text-sm font-medium">Description</label><textarea name="desc_en" className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
            <div className="space-y-3"><p className="text-sm font-medium text-primary">🇰🇬 Перевод (Кыргызча)</p><Input name="name_kg" label="Аталышы" /><div className="space-y-1.5"><label className="block text-sm font-medium">Сүрөттөмө</label><textarea name="desc_kg" className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]" /></div></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Цена и наличие</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="price" type="number" step="0.01" label="Цена (сом)" required />
              <Input name="stock" type="number" label="Количество" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Категория</label>
              <select
                name="categoryId"
                required
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
        <Button type="submit" size="lg" className="w-full" isLoading={loading}>{t("addProduct")}</Button>
      </form>
    </div>
  );
}
