import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface AgentControlProps {
  onRun: (input: string) => void;
  isWorking: boolean;
  hasMessages: boolean;
}

const SUGGESTIONS = [
  "Plan a trip to Kerala focusing on nature and hill stations.",
  "Check if Sulaiman is in the system and what the weather is like where he might be.",
];

const AgentControl: React.FC<AgentControlProps> = React.memo(
  ({ onRun, isWorking, hasMessages }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (input.trim() && !isWorking) {
        onRun(input);
        setInput(""); // Clear input after running
      }
    };

    const handleSuggestion = (suggestion: string) => {
      if (!isWorking) {
        onRun(suggestion);
      }
    };

    return (
      <div className="w-full flex flex-col gap-4 group/control">
        {/* SUGGESTIONS */}
        {!isWorking && !hasMessages && (
          <div className="flex flex-wrap gap-2 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(s)}
                className="px-3.5 py-2 bg-white border border-[#E6E1D6] rounded-full text-[11px] font-medium text-[#7A7468] hover:border-[#D97757]/40 hover:text-[#D97757] hover:bg-[#F7F4EF] transition-all shadow-sm active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group px-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you want to research?"
            disabled={isWorking}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full min-h-[60px] bg-white border border-[#E6E1D6] rounded-[24px] p-4 pr-14 text-[#333333] placeholder-[#A09B8E] focus:outline-none focus:ring-4 focus:ring-[#D97757]/5 focus:border-[#D97757]/30 transition-all resize-none font-sans text-base leading-relaxed shadow-sm group-hover:shadow-md"
            rows={1}
          />

          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              disabled={isWorking || !input.trim()}
              className={`p-2.5 rounded-xl transition-all ${
                isWorking
                  ? "text-[#A09B8E] cursor-not-allowed"
                  : "text-[#D97757] hover:bg-[#D97757]/10 active:scale-95"
              }`}
            >
              {isWorking ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#D97757]" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

export default AgentControl;
