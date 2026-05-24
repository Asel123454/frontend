import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Craft & Organic KG",
  description: "Маркетплейс ремесленных и органических товаров Кыргызстана",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
