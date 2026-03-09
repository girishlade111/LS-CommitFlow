/**
 * Auth Layout
 * White background layout for authentication pages
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white">
      {children}
    </div>
  );
}
