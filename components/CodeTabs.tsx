"use client";

import { useState, useEffect, useCallback } from "react";

export type Lang = "php" | "ruby" | "java" | "nodejs" | "go" | "python";

export const LANG_LABELS: Record<Lang, string> = {
  php: "PHP",
  ruby: "Ruby",
  java: "Java",
  nodejs: "Node.js",
  go: "Go",
  python: "Python",
};

export const ALL_LANGS: Lang[] = ["php", "ruby", "java", "nodejs", "go", "python"];

export const LS_KEY = "preferred-lang";

// ─── CopyButton (inline — avoids extra import in client bundle) ──────────────

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600 transition-colors z-10"
    >
      {copied ? "✓" : "Copy"}
    </button>
  );
}

// ─── HighlightedPane — renders pre-highlighted HTML ──────────────────────────

function HighlightedPane({ html, rawCode }: { html: string; rawCode: string }) {
  return (
    <div className="relative">
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton code={rawCode} />
    </div>
  );
}

// ─── CodeTabs — language tabs over pre-highlighted code ──────────────────────

export interface HighlightedTab {
  lang: Lang;
  html: string;   // Shiki HTML
  raw: string;    // raw code for copy button
}

export function CodeTabs({ tabs }: { tabs: HighlightedTab[] }) {
  const [active, setActive] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LS_KEY) as Lang | null;
      if (saved && tabs.some((t) => t.lang === saved)) return saved;
    }
    return tabs[0]?.lang ?? "nodejs";
  });

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Lang | null;
    if (saved && tabs.some((t) => t.lang === saved)) setActive(saved);
  }, [tabs]);

  const select = useCallback((lang: Lang) => {
    setActive(lang);
    localStorage.setItem(LS_KEY, lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const lang = (e as CustomEvent<Lang>).detail;
      if (tabs.some((t) => t.lang === lang)) setActive(lang);
    }
    window.addEventListener("lang-change", handler);
    return () => window.removeEventListener("lang-change", handler);
  }, [tabs]);

  const current = tabs.find((t) => t.lang === active) ?? tabs[0];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex gap-0 bg-zinc-100 dark:bg-zinc-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.lang}
            onClick={() => select(tab.lang)}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              active === tab.lang
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-b-2 border-blue-600"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {LANG_LABELS[tab.lang]}
          </button>
        ))}
      </div>
      {current && <HighlightedPane html={current.html} rawCode={current.raw} />}
    </div>
  );
}

// ─── SideBySideCodeTabs — old/new side-by-side + language tabs ───────────────

export function SideBySideCodeTabs({
  tabs,
  oldLabel,
  newLabel,
}: {
  tabs: OldNewTab[];
  oldLabel: string;
  newLabel: string;
}) {
  const [active, setActive] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LS_KEY) as Lang | null;
      if (saved && tabs.some((t) => t.lang === saved)) return saved;
    }
    return tabs[0]?.lang ?? "nodejs";
  });

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Lang | null;
    if (saved && tabs.some((t) => t.lang === saved)) setActive(saved);
  }, [tabs]);

  const select = useCallback((lang: Lang) => {
    setActive(lang);
    localStorage.setItem(LS_KEY, lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const lang = (e as CustomEvent<Lang>).detail;
      if (tabs.some((t) => t.lang === lang)) setActive(lang);
    }
    window.addEventListener("lang-change", handler);
    return () => window.removeEventListener("lang-change", handler);
  }, [tabs]);

  const current = tabs.find((t) => t.lang === active) ?? tabs[0];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex gap-0 bg-zinc-100 dark:bg-zinc-800 overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.lang}
            onClick={() => select(tab.lang)}
            className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              active === tab.lang
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-b-2 border-blue-600"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {LANG_LABELS[tab.lang]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-700">
        <div className="flex flex-col min-w-0">
          <div className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-b border-zinc-200 dark:border-zinc-700">
            ❌ {oldLabel}
          </div>
          <div className="overflow-x-auto">
            {current && <HighlightedPane html={current.oldHtml} rawCode={current.oldRaw} />}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="px-3 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-b border-zinc-200 dark:border-zinc-700">
            ✅ {newLabel}
          </div>
          <div className="overflow-x-auto">
            {current && <HighlightedPane html={current.newHtml} rawCode={current.newRaw} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OldNewCodeTabs — old/new toggle + language tabs ─────────────────────────

export interface OldNewTab {
  lang: Lang;
  oldHtml: string;
  newHtml: string;
  oldRaw: string;
  newRaw: string;
}

export function OldNewCodeTabs({
  tabs,
  oldLabel,
  newLabel,
}: {
  tabs: OldNewTab[];
  oldLabel: string;
  newLabel: string;
}) {
  const [view, setView] = useState<"old" | "new">("new");
  const [active, setActive] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LS_KEY) as Lang | null;
      if (saved && tabs.some((t) => t.lang === saved)) return saved;
    }
    return tabs[0]?.lang ?? "nodejs";
  });

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Lang | null;
    if (saved && tabs.some((t) => t.lang === saved)) setActive(saved);
  }, [tabs]);

  const select = useCallback((lang: Lang) => {
    setActive(lang);
    localStorage.setItem(LS_KEY, lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const lang = (e as CustomEvent<Lang>).detail;
      if (tabs.some((t) => t.lang === lang)) setActive(lang);
    }
    window.addEventListener("lang-change", handler);
    return () => window.removeEventListener("lang-change", handler);
  }, [tabs]);

  const current = tabs.find((t) => t.lang === active) ?? tabs[0];
  const html = current ? current[view === "old" ? "oldHtml" : "newHtml"] : "";
  const raw = current ? current[view === "old" ? "oldRaw" : "newRaw"] : "";

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 px-2 py-1.5 gap-2 flex-wrap">
        <div className="flex gap-1">
          {(["old", "new"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                view === v
                  ? "bg-blue-600 text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {v === "old" ? oldLabel : newLabel}
            </button>
          ))}
        </div>
        <div className="flex overflow-x-auto gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.lang}
              onClick={() => select(tab.lang)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded transition-colors ${
                active === tab.lang
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {LANG_LABELS[tab.lang]}
            </button>
          ))}
        </div>
      </div>
      <HighlightedPane html={html} rawCode={raw} />
    </div>
  );
}
