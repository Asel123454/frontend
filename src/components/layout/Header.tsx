"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  LayoutDashboard,
  Globe,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  kg: "Кыргызча",
  ru: "Русский",
  en: "English",
};

export function Header() {
  const t = useTranslations("common");
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as Locale) || "ru";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="gradient-text">Craft</span>
              <span className="text-foreground">&nbsp;&&nbsp;</span>
              <span className="gradient-text">Organic</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {t("home")}
            </Link>
            <Link
              href="/products"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/products") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {t("products")}
            </Link>
            <Link
              href="/categories"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/categories") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {t("categories")}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline uppercase">{locale}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-card shadow-lg py-1 animate-in">
                  {(["kg", "ru", "en"] as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                        locale === l ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {localeLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-lg py-1 animate-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4" /> {t("profile")}
                    </Link>
                    <Link
                      href="/profile/orders"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Package className="w-4 h-4" /> {t("myOrders")}
                    </Link>
                    {user.role === "SELLER" && (
                      <Link
                        href="/seller"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> {t("logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t("login")}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t("register")}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2 animate-in">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              {t("home")}
            </Link>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              {t("products")}
            </Link>
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              {t("categories")}
            </Link>
            {!user && (
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">{t("login")}</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">{t("register")}</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
