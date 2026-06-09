"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { MappingRow, ApiType } from "@/data/api-mapping";
import { ALL_LANGS, LANG_LABELS, LS_KEY, type Lang } from "@/components/CodeTabs";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HighlightedSnippet {
  old: Record<Lang, string>; // Shiki HTML
  new: Record<Lang, string>; // Shiki HTML
  oldRaw: Record<Lang, string>; // raw code for copy
  newRaw: Record<Lang, string>;
}

export interface RowWithSnippet extends MappingRow {
  snippet?: HighlightedSnippet;
}

// ─── Badge ───────────────────────────────────────────────────────────────────

const typeBadge: Record<ApiType, string> = {
  graphql: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  rest: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "not-migrated": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// ─── CopyButton ──────────────────────────────────────────────────────────────

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

// ─── CodePanel ───────────────────────────────────────────────────────────────

function CodePanel({
  snippet,
  lang,
  oldLabel,
  newLabel,
}: {
  snippet: HighlightedSnippet;
  lang: Lang;
  oldLabel: string;
  newLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div>
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">❌ {oldLabel}</p>
        <div className="relative rounded-lg overflow-hidden border border-zinc-700">
          <div className="text-sm overflow-x-auto" dangerouslySetInnerHTML={{ __html: snippet.old[lang] ?? "" }} />
          <CopyButton code={snippet.oldRaw[lang] ?? ""} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5">✅ {newLabel}</p>
        <div className="relative rounded-lg overflow-hidden border border-zinc-700">
          <div className="text-sm overflow-x-auto" dangerouslySetInnerHTML={{ __html: snippet.new[lang] ?? "" }} />
          <CopyButton code={snippet.newRaw[lang] ?? ""} />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExpandableApiTable({ rows }: { rows: RowWithSnippet[] }) {
  const t = useTranslations("common");

  const [openRows, setOpenRows] = useState<Set<number>>(new Set());
  const [activeLang, setActiveLang] = useState<Lang>("nodejs");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Lang | null;
    if (saved && ALL_LANGS.includes(saved)) setActiveLang(saved);
  }, []);

  const selectLang = useCallback((lang: Lang) => {
    setActiveLang(lang);
    localStorage.setItem(LS_KEY, lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const lang = (e as CustomEvent<Lang>).detail;
      if (ALL_LANGS.includes(lang)) setActiveLang(lang);
    }
    window.addEventListener("lang-change", handler);
    return () => window.removeEventListener("lang-change", handler);
  }, []);

  function toggleRow(i: number) {
    setOpenRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const typeLabels: Record<ApiType, string> = {
    graphql: t("graphql"),
    rest: t("rest"),
    "not-migrated": t("notMigrated"),
  };

  const hasAnySnippet = rows.some((r) => !!r.snippet);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Language switcher */}
      {hasAnySnippet && (
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 flex-wrap">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
            {t("codeLanguage")}:
          </span>
          {ALL_LANGS.map((lang) => (
            <button
              key={lang}
              onClick={() => selectLang(lang)}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                activeLang === lang
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              }`}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      )}

      {/* overflow-x-auto で横スクロール対応 */}
      <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            {hasAnySnippet && <th className="w-8" />}
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-[28%]">{t("oldApi")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-[35%]">{t("newApi")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-20">{t("type")}</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("notes")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {rows.map((row, i) => {
            const isOpen = openRows.has(i);
            const hasSnippet = !!row.snippet;

            return (
              <React.Fragment key={i}>
                <tr
                  className={`${
                    row.type === "not-migrated"
                      ? "bg-red-50 dark:bg-red-950/20"
                      : hasSnippet
                      ? "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  } transition-colors`}
                  onClick={hasSnippet ? () => toggleRow(i) : undefined}
                >
                  {hasAnySnippet && (
                    <td className="pl-3 pr-1 py-3 align-top w-8">
                      {hasSnippet && (
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold transition-transform duration-150 ${
                            isOpen
                              ? "bg-blue-600 text-white rotate-90"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          ▶
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 align-top">
                    {row.oldApi}
                    {hasSnippet && !isOpen && (
                      <span className="ml-2 text-blue-500 text-[10px] font-sans">コードを見る</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 align-top">
                    {row.type === "not-migrated" ? "—" : row.newOperation}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeBadge[row.type]}`}>
                      {typeLabels[row.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 align-top">{row.notes ?? ""}</td>
                </tr>

                {hasSnippet && isOpen && (
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                    <td colSpan={hasAnySnippet ? 5 : 4} className="px-4 py-4">
                      <CodePanel
                        snippet={row.snippet!}
                        lang={activeLang}
                        oldLabel={t("viewOldCode")}
                        newLabel={t("viewNewCode")}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
