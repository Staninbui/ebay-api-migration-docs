interface PageLayoutProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, subtitle, badge, children }: PageLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        {badge && (
          <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400 font-mono">{subtitle}</p>
        )}
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

export function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700 pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ScopeTag({ scope }: { scope: string }) {
  return (
    <span className="inline-block font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
      {scope}
    </span>
  );
}
