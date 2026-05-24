"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const result = await register({ name, email, password, role });
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-in">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("registerTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <Input name="name" label={t("name")} placeholder={t("name")} required />
            <Input name="email" type="email" label={t("email")} placeholder="email@example.com" required />
            <Input name="password" type="password" label={t("password")} placeholder="••••••" required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">{t("role")}</label>
              <select
                name="role"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue="BUYER"
              >
                <option value="BUYER">{t("buyer")}</option>
                <option value="SELLER">{t("seller")}</option>
              </select>
            </div>
            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              {t("registerTitle")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t("signIn")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
