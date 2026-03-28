import React, { useEffect, useRef, useState } from "react";
import {
  Brain,
  Wrench,
  Zap,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { LogStep } from "../hooks/types";
import JsonCodeBlock from "./JsonCodeBlock";

interface ThoughtLogProps {
  steps: LogStep[];
  isWorking: boolean;
}

const ThoughtLog: React.FC<ThoughtLogProps> = ({ steps, isWorking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRawSteps, setShowRawSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [steps]);

  const toggleRaw = (idx: number) => {
    setShowRawSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getStepStyle = (type: LogStep["type"]) => {
    switch (type) {
      case "THINKING":
        return {
          icon: <Brain className="w-3.5 h-3.5" />,
          color: "text-blue-500",
          bg: "bg-blue-50",
          tag: "STRATEGY",
        };
      case "TOOL_REQUEST":
        return {
          icon: <Wrench className="w-3.5 h-3.5" />,
          color: "text-amber-500",
          bg: "bg-amber-50",
          tag: "PLANNING",
        };
      case "EXECUTING":
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          color: "text-[#D97757]",
          bg: "bg-[#D97757]/5",
          tag: "ACTION",
        };
      case "OBSERVATION":
        return {
          icon: <Eye className="w-3.5 h-3.5" />,
          color: "text-emerald-500",
          bg: "bg-emerald-50",
          tag: "EVIDENCE",
        };
      case "ERROR":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          color: "text-red-500",
          bg: "bg-red-50",
          tag: "ERROR",
        };
      case "COMPLETED":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          tag: "FINISH",
        };
      case "SUMMARY":
        return {
          icon: <BarChart3 className="w-3.5 h-3.5" />,
          color: "text-[#A09B8E]",
          bg: "bg-[#A09B8E]/5",
          tag: "SUMMARY",
        };
      default:
        return {
          icon: <Brain className="w-3.5 h-3.5" />,
          color: "text-[#A09B8E]",
          bg: "bg-[#A09B8E]/5",
          tag: "STEP",
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF9F4] p-4 lg:p-5 border-l border-[#E6E1D6]/40">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-[#D97757]/10 rounded-full border border-[#D97757]/20">
            <span className="text-[10px] text-[#D97757] font-mono font-bold tracking-widest uppercase">
              Reasoning Trace
            </span>
          </div>
          {isWorking && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D97757]/5 border border-[#D97757]/20 rounded-full animate-pulse">
              <Sparkles className="w-2.5 h-2.5 text-[#D97757]" />
              <span className="text-[9px] text-[#D97757] font-bold uppercase tracking-tight">
                Processing
              </span>
            </div>
          )}
        </div>
      </div>

      {/* TIMELINE CONTAINER */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 relative scrollbar-thin pr-2"
      >
        {/* Continuous Vertical Line */}
        {steps.length > 0 && (
          <div className="absolute left-3.25 top-6 bottom-6 w-0.5 bg-[#E6E1D6]/40 z-0" />
        )}

        {steps.length === 0 && !isWorking && (
          <div className="text-[#A09B8E] text-[12px] italic mt-2 opacity-60">
            Waiting for user input to trace the reasoning workflow...
          </div>
        )}

        {steps.map((step, idx) => {
          const style = getStepStyle(step.type);
          const isLast = idx === steps.length - 1;
          const isActive = isLast && isWorking;
          const isMilestone = step.message.includes("INPUT") || step.message.includes("RESPONSE");
          const isRawOpen = showRawSteps[idx];

          return (
            <div
              key={idx}
              className={`relative z-10 animate-in fade-in slide-in-from-left-4 duration-500 ease-out`}
            >
              <div className="flex gap-4">
                {/* ICON NODE */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[#D97757] border-[#D97757] shadow-[0_0_12px_rgba(217,119,87,0.4)]"
                      : isMilestone
                        ? "bg-white border-[#333333] z-20"
                        : "bg-white border-[#E6E1D6] group-hover:border-[#A09B8E]"
                  }`}
                >
                  {isActive ? (
                    <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  ) : (
                    <div className={style.color}>{style.icon}</div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0 pt-0.5 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        isMilestone
                          ? "bg-[#333333] border-[#333333] text-white"
                          : `${style.bg} ${style.color} border-current border-opacity-20`
                      }`}
                    >
                      {style.tag}
                    </span>
                    <h4
                      className={`text-[13px] font-bold tracking-tight truncate ${
                        isMilestone ? "text-[#333333] text-[14px]" : "text-[#555555]"
                      }`}
                    >
                      {step.message}
                    </h4>

                    {(step.args !== undefined || step.result !== undefined) && (
                      <button
                        onClick={() => toggleRaw(idx)}
                        className={`ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border rounded transition-all ${
                          isRawOpen
                            ? "bg-[#333333] border-[#333333] text-white"
                            : "border-[#E6E1D6] text-[#A09B8E] hover:border-black hover:text-black"
                        }`}
                      >
                        JSON
                      </button>
                    )}
                  </div>

                  <p
                    className={`text-[12px] leading-relaxed font-medium selection:bg-black/5 ${
                      step.type === "ERROR" ? "text-red-500" : "text-[#888888]"
                    } ${isMilestone ? "text-[#333333] font-bold" : ""}`}
                  >
                    {step.description}
                  </p>

                  {/* DATA DISPLAY (INLINE & COMPACT) */}
                  {isRawOpen && (step.args !== undefined || step.result !== undefined) && (
                    <div className="mt-2 animate-in zoom-in-95 duration-200">
                      <JsonCodeBlock
                        data={step.args || step.result}
                        label={step.args ? "Parameters" : "Result"}
                        maxHeight="max-h-48"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ACTIVE PULSING DOT IF STILL WORKING */}
        {isWorking && steps.length > 0 && (
          <div className="relative pl-7.5 pt-1">
            <div className="absolute left-3.25 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#E6E1D6]/40 to-transparent" />
            <div className="flex items-center gap-3 py-1">
              <div className="w-1.5 h-1.5 bg-[#D97757] rounded-full animate-bounce" />
              <span className="text-[11px] text-[#A09B8E] font-medium italic animate-pulse">
                Exploring alternative reasoning paths...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtLog;
