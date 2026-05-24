"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User } from "lucide-react";

interface UserItem {
  id: string; email: string; name: string | null; role: string;
  _count: { products: number; orders: number };
}

export default function AdminUsersPage() {
  const { token, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchAPI<UserItem[]>("/api/users", { token }).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in">
      <h1 className="text-3xl font-bold mb-8">Пользователи ({users.length})</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0"><p className="font-medium truncate">{u.name || "No name"}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
              <Badge>{u.role}</Badge>
              <div className="text-xs text-muted-foreground text-right"><p>Products: {u._count.products}</p><p>Orders: {u._count.orders}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
