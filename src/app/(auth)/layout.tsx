export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-parchment to-background flex items-center justify-center">
      {children}
    </div>
  );
}
