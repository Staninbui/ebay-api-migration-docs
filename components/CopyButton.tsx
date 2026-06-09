"use client";

import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600 transition-colors backdrop-blur-sm z-10"
    >
      {copied ? "✓" : "Copy"}
    </button>
  );
}
