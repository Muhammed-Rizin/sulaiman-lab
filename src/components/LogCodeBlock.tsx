import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface LogCodeBlockProps {
  content: string;
  label?: string;
  maxHeight?: string;
}

const LogCodeBlock: React.FC<LogCodeBlockProps> = ({ content, label, maxHeight = "max-h-96" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden my-4 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#252525]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#888888]" />
          <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
            {label || "System Log"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 px-2 hover:bg-white/5 rounded transition-colors text-[#888888] hover:text-white flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span className="text-[9px] uppercase font-bold">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className={`p-5 overflow-auto scrollbar-thin ${maxHeight}`}>
        <pre className="text-[11px] font-mono leading-relaxed whitespace-pre font-medium text-[#E0E0E0]">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default React.memo(LogCodeBlock);
