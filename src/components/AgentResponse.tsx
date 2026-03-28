import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

interface AgentResponseProps {
  response: string | null;
  isVisible: boolean;
  role?: "user" | "assistant";
}

const AgentResponse: React.FC<AgentResponseProps> = ({
  response,
  isVisible,
  role = "assistant",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isVisible, response]);

  if (!isVisible || !response) return null;

  const isUser = role === "user";

  return (
    <div
      ref={scrollRef}
      className={`relative w-full flex flex-col transition-all duration-700 ${
        isUser ? "items-end mb-6" : "items-start mb-6"
      }`}
    >
      <div
        className={`${
          isUser
            ? "max-w-[85%] bg-[#ECE9E1] rounded-3xl px-6 py-4 border border-[#E6E1D6]/40 shadow-sm"
            : "w-full bg-[#FBF9F6] rounded-3xl px-8 py-8 border border-[#E6E1D6]/40 shadow-sm"
        }`}
      >
        {/* Role Indicator (Subtle) */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <Sparkles className="w-3 h-3 text-[#D97757]" />
            <span className="text-[#333333] font-sans font-bold text-[9px] tracking-widest uppercase">
              Assistant
            </span>
          </div>
        )}

        {/* CONTENT */}
        <div
          className={`prose prose-slate max-w-none overflow-auto no-scrollbar ${
            isUser
              ? "prose-p:font-sans prose-p:text-[15px] prose-p:text-[#333333]/90"
              : "prose-p:font-serif prose-p:text-[20px] prose-p:leading-[1.7] prose-p:text-[#1D1D1D] prose-strong:text-[#D97757] prose-headings:font-serif prose-headings:text-[#1D1D1D] prose-li:font-serif prose-li:text-[18px] prose-li:leading-relaxed prose-li:my-2"
          } prose-table:border-[#E6E1D6]/40`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default AgentResponse;
