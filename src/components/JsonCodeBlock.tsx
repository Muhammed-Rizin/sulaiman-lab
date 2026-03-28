import React, { useState } from "react";
import { Database, Copy, Check } from "lucide-react";

interface JsonCodeBlockProps {
  data: unknown;
  label?: string;
  maxHeight?: string;
}

const JsonCodeBlock: React.FC<JsonCodeBlockProps> = ({ data, label, maxHeight = "max-h-96" }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightJson = (json: string) => {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-[#1D1D1D]";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-[#A0522D]"; // earthy key
          } else {
            cls = "text-[#4A4A4A]"; // string value
          }
        } else if (/true|false/.test(match)) {
          cls = "text-[#D97757]"; // boolean
        } else if (/null/.test(match)) {
          cls = "text-[#A09B8E]"; // null
        } else {
          cls = "text-[#2D5A27]"; // earthy green
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <div className="group relative bg-[#FBF9F6] border border-[#E6E1D6] rounded-xl overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E6E1D6] bg-[#F2EFE8]">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#A09B8E]" />
          <span className="text-[10px] font-bold text-[#A09B8E] uppercase tracking-widest font-mono">
            {label || "JSON DATA"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 px-2 hover:bg-black/5 rounded transition-colors text-[#A09B8E] hover:text-[#333333] flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span className="text-[9px] uppercase font-bold">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className={`p-5 overflow-auto scrollbar-thin ${maxHeight}`}>
        <pre
          className="text-[11px] font-mono leading-relaxed whitespace-pre font-medium text-[#1D1D1D]"
          dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }}
        />
      </div>
    </div>
  );
};

export default React.memo(JsonCodeBlock);
