"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
  const tc = useTranslations("common");
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!user) return <div className="max-w-3xl mx-auto px-4 py-16 text-center">Please log in</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">{tc("profile")}</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <Badge className="mt-1">{user.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Роль</p>
                <p className="text-sm font-medium">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
