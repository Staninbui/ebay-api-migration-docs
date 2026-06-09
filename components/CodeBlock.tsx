/**
 * Server component — renders Shiki-highlighted code.
 * Use this in server pages. For client components, use HighlightedPre.
 */
import { highlight } from "@/lib/highlight";
import CopyButton from "@/components/CopyButton";

interface CodeBlockProps {
  code: string;
  lang: string;
}

export default async function CodeBlock({ code, lang }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return (
    <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton code={code} />
    </div>
  );
}
