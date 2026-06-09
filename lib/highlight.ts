import { codeToHtml } from "shiki";

// lang name → Shiki language id
const LANG_MAP: Record<string, string> = {
  php: "php",
  ruby: "ruby",
  java: "java",
  nodejs: "javascript",
  go: "go",
  python: "python",
  graphql: "graphql",
  bash: "bash",
  json: "json",
  xml: "xml",
  http: "http",
  text: "text",
};

export async function highlight(code: string, lang: string): Promise<string> {
  const shikiLang = LANG_MAP[lang] ?? "bash";
  const opts = {
    themes: { light: "github-light", dark: "github-dark" },
    // defaultColor: false → no inline color values, only CSS custom properties.
    // This lets our .dark selector override colors without !important.
    defaultColor: false,
  } as const;
  try {
    return await codeToHtml(code, { lang: shikiLang, ...opts });
  } catch {
    return await codeToHtml(code, { lang: "text", ...opts });
  }
}
