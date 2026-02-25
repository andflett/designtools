"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  live?: boolean;
  className?: string;
}

function highlightJsx(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = code;
  let key = 0;

  while (remaining.length > 0) {
    let match: RegExpMatchArray | null = null;
    let earliest = Infinity;
    let type = "";

    const patterns: [string, RegExp][] = [
      ["comment-block", /\{\/\*[\s\S]*?\*\/\}/],
      ["comment-line", /\/\/.*/],
      ["tag", /<\/?[A-Z][A-Za-z0-9.]*/],
      ["string", /"[^"]*"/],
      ["attribute", /\b[a-zA-Z][\w-]*(?==)/],
      ["braces", /\{[^}]*\}/],
    ];

    for (const [t, pattern] of patterns) {
      const m = remaining.match(pattern);
      if (m && m.index !== undefined && m.index < earliest) {
        earliest = m.index;
        match = m;
        type = t;
      }
    }

    if (!match || match.index === undefined) {
      tokens.push(remaining);
      break;
    }

    if (match.index > 0) {
      tokens.push(remaining.slice(0, match.index));
    }

    const text = match[0];

    switch (type) {
      case "comment-block":
      case "comment-line":
        tokens.push(
          <span key={key++} className="text-neutral-500">
            {text}
          </span>
        );
        break;
      case "tag":
        tokens.push(
          <span key={key++} className="text-primary-300">
            {text}
          </span>
        );
        break;
      case "string":
        tokens.push(
          <span key={key++} className="text-success-300">
            {text}
          </span>
        );
        break;
      case "attribute":
        tokens.push(
          <span key={key++} className="text-warning-300">
            {text}
          </span>
        );
        break;
      case "braces":
        tokens.push(
          <span key={key++} className="text-neutral-300">
            {text}
          </span>
        );
        break;
      default:
        tokens.push(text);
    }

    remaining = remaining.slice(match.index + text.length);
  }

  return tokens;
}

export function CodeBlock({ code, live, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={`relative rounded-lg bg-neutral-950 ${className ?? ""}`}>
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        {live && (
          <div className="flex items-center gap-1.5 text-xs text-success-400">
            <span className="inline-block h-2 w-2 rounded-full bg-success-400" />
            Live
          </div>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-neutral-100">
          {highlightJsx(code)}
        </code>
      </pre>
    </div>
  );
}
