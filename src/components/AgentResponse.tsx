import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      className={`relative w-full flex flex-col transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 ${
        isUser ? "items-end mb-8" : "items-start mb-12"
      }`}
    >
      <div
        className={`group relative ${
          isUser
            ? "max-w-[85%] bg-[#F0EBE0] rounded-2xl rounded-tr-sm px-6 py-4 border border-[#D9D4C7] shadow-sm hover:border-[#D97757]/20 transition-all"
            : "w-full bg-white rounded-3xl px-2 py-2 md:px-4 md:py-4 transition-all"
        }`}
      >
        {/* CONTENT */}
        <div
          className={`prose max-w-none overflow-auto no-scrollbar selection:bg-[#D97757]/10 ${
            isUser
              ? "prose-p:font-sans prose-p:text-[15px] prose-p:text-[#333333] prose-p:leading-relaxed"
              : "prose-p:font-serif prose-p:text-[20px] prose-p:leading-[1.8] prose-p:text-[#1A1A1A] prose-strong:text-[#D97757] prose-headings:font-serif prose-headings:text-[#1A1A1A] prose-headings:mt-10 prose-headings:mb-6 prose-li:font-serif prose-li:text-[19px] prose-li:leading-relaxed prose-li:my-4 prose-code:bg-[#FBF9F4] prose-code:text-[#D97757] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1A1A1A] prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:p-8"
          } prose-table:border-[#E6E1D6]/40`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
        </div>
      </div>

      {!isUser && (
        <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E6E1D6]/30 to-transparent" />
      )}
    </div>
  );
};


export default AgentResponse;
