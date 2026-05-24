import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variant === "default" && "badge-primary",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        variant === "danger" && "badge-danger",
        variant === "outline" && "border border-border bg-transparent text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
