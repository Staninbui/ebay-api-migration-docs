import PageLayout, { Section, ScopeTag } from "@/components/PageLayout";
import ApiMappingTable from "@/components/ApiMappingTable";
import type { MappingSection } from "@/data/api-mapping";

interface MigrationPageProps {
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    description?: string;
    mapping: MappingSection;
    scope?: string;
    noteKey?: string;
  }[];
  noteContent?: React.ReactNode;
  children?: React.ReactNode;
}

export default function MigrationPage({
  title,
  subtitle,
  sections,
  children,
}: MigrationPageProps) {
  return (
    <PageLayout title={title} subtitle={subtitle} badge="Migration Guide">
      {sections.map((sec, i) => (
        <Section key={i} title={sec.heading} id={sec.mapping.id}>
          {sec.scope && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Scope:</span>
              <ScopeTag scope={sec.scope} />
            </div>
          )}
          {sec.description && (
            <p className="text-zinc-600 dark:text-zinc-400">{sec.description}</p>
          )}
          <ApiMappingTable rows={sec.mapping.rows} />
        </Section>
      ))}
      {children}
    </PageLayout>
  );
}
