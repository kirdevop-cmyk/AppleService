import Link from 'next/link';

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Хлібні крихти" className="mb-5 flex flex-wrap gap-1.5 font-mono text-xs text-ash">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="hover:text-accent-3">
              {it.name}
            </Link>
          ) : (
            <span className="text-white/80">{it.name}</span>
          )}
          {i < items.length - 1 && <span className="text-smoke">/</span>}
        </span>
      ))}
    </nav>
  );
}
