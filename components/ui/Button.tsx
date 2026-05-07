import Link from "next/link";
type ButtonProps = { href: string; children: React.ReactNode; variant?: "primary" | "secondary"; external?: boolean; };
export function Button({ href, children, variant = "primary", external = false }: ButtonProps) {
  const className = variant === "primary" ? "rounded-full bg-[var(--button-primary-bg)] px-6 py-3 font-medium text-[var(--button-primary-text)] premium-glow transition-opacity hover:opacity-95" : "rounded-full border border-[var(--button-secondary-border)] px-6 py-3 font-medium text-[var(--button-secondary-text)] transition-colors hover:border-[var(--button-secondary-border-hover)]";
  if (external) return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <Link href={href} className={className}>{children}</Link>;
}
