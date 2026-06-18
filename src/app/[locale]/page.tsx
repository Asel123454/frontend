import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Leaf, HandHeart, MapPin, ArrowRight, Sparkles, Shield, Truck, Store } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div className="animate-in">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden min-h-[80vh] lg:min-h-[90vh] flex items-center pt-20 pb-16 lg:py-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t("hero.badge")}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-balance">
                <span className="gradient-text">{t("hero.title")}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2 text-base h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    {t("hero.cta")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image with Floating Animation */}
            <div className="relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 hidden sm:block" />
              <img 
                src="/images/honey.png" 
                alt="Organic Honey" 
                className="relative z-10 w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover rounded-3xl shadow-2xl animate-floating border border-white/10"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-10 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl flex items-center gap-4 animate-floating" style={{ animationDelay: "1s" }}>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold">{t("whyUs.organic")}</p>
                  <p className="text-xs text-muted-foreground">{t("hero.organicBadge")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories (New Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">{t("popularCategories.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <Link href="/products" className="group block relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg">
            <img 
              src="/images/produce.png" 
              alt="Organic Food" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-2xl font-bold text-white mb-2">{t("popularCategories.organic")}</h3>
              <span className="text-white/80 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {t("popularCategories.viewProducts")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          
          {/* Category 2 */}
          <Link href="/products" className="group block relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg">
            <img 
              src="/images/felt.png" 
              alt="Felt Crafts" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-2xl font-bold text-white mb-2">{t("popularCategories.felt")}</h3>
              <span className="text-white/80 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {t("popularCategories.viewProducts")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          
          {/* Category 3 */}
          <Link href="/products" className="group block relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg">
            <img 
              src="/images/honey.png" 
              alt="Natural Cosmetics" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-2xl font-bold text-white mb-2">{t("popularCategories.cosmetics")}</h3>
              <span className="text-white/80 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {t("popularCategories.viewProducts")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Features (Glassmorphism Upgrade) */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">{t("whyUs.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">{t("whyUs.organic")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("whyUs.organicDesc")}</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <HandHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">{t("whyUs.handmade")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("whyUs.handmadeDesc")}</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">{t("whyUs.local")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("whyUs.localDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="relative p-8 sm:p-20 text-center flex flex-col items-center justify-center">
            <Store className="w-12 h-12 sm:w-16 sm:h-16 mb-6 opacity-80" />
            <h2 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-6 max-w-2xl">{t("sellerCta.title")}</h2>
            <p className="text-base sm:text-xl opacity-80 mb-8 sm:mb-10 max-w-2xl">
              {t("sellerCta.subtitle")}
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20">
                {t("sellerCta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <Shield className="w-8 h-8 text-muted-foreground opacity-50" />
            <div>
              <h4 className="font-semibold">{t("trustBadges.secure")}</h4>
              <p className="text-sm text-muted-foreground">{t("trustBadges.secureDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <Truck className="w-8 h-8 text-muted-foreground opacity-50" />
            <div>
              <h4 className="font-semibold">{t("trustBadges.delivery")}</h4>
              <p className="text-sm text-muted-foreground">{t("trustBadges.deliveryDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <HandHeart className="w-8 h-8 text-muted-foreground opacity-50" />
            <div>
              <h4 className="font-semibold">{t("trustBadges.support")}</h4>
              <p className="text-sm text-muted-foreground">{t("trustBadges.supportDesc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}