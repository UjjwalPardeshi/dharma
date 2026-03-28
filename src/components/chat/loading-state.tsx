"use client";

export function LoadingState() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-sm text-muted-foreground font-medium">
        Consulting the ancient texts...
      </span>
    </div>
  );
}
