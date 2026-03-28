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
  Terminal,
  Info,
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
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

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
          tag: "THOUGHT",
        };
      case "TOOL_REQUEST":
        return {
          icon: <Wrench className="w-3.5 h-3.5" />,
          color: "text-amber-500",
          bg: "bg-amber-50",
          tag: "INTENT",
        };
      case "EXECUTING":
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          color: "text-[#D97757]",
          bg: "bg-[#D97757]/5",
          tag: "EXECUTE",
        };
      case "OBSERVATION":
        return {
          icon: <Eye className="w-3.5 h-3.5" />,
          color: "text-emerald-500",
          bg: "bg-emerald-50",
          tag: "OBSERVE",
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
          tag: "SUCCESS",
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
    <div className="flex flex-col h-full bg-[#FBF9F4] border-l border-[#E6E1D6]/40">
      {/* HEADER */}
      <div className="flex items-center justify-between p-5 border-b border-[#E6E1D6]/30 bg-white/50 backdrop-blur-sm shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#333333] rounded-lg shadow-sm ring-1 ring-black/5">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-black tracking-[0.2em] text-[#333333] uppercase">
              Reasoning Trace
            </h3>
            {isWorking && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tight">Active Engine</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsDeveloperMode(!isDeveloperMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            isDeveloperMode
              ? "bg-[#333333] border-[#333333] text-white shadow-md shadow-black/10"
              : "border-[#E6E1D6] text-[#A09B8E] hover:border-[#333333] hover:text-[#333333]"
          }`}
          title={isDeveloperMode ? "Switch to User View" : "Switch to Developer View"}
        >
          {isDeveloperMode ? <Terminal size={12} /> : <Info size={12} />}
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {isDeveloperMode ? "Dev" : "User"}
          </span>
        </button>
      </div>

      {/* TIMELINE CONTAINER */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 relative no-scrollbar p-5 lg:p-6"
      >
        {/* Continuous Vertical Line */}
        {steps.length > 0 && (
          <div className="absolute left-8.5 top-6 bottom-6 w-0.5 bg-[#E6E1D6]/50 z-0" />
        )}

        {steps.length === 0 && !isWorking && (
          <div className="flex flex-col items-center justify-center h-64 opacity-40 text-center">
             <Brain className="w-8 h-8 text-[#A09B8E] mb-4 stroke-1" />
             <p className="text-[11px] text-[#A09B8E] font-medium italic max-w-45">
               Waiting for input to trace the reasoning workflow...
             </p>
          </div>
        )}

        {steps.map((step, idx) => {
          const style = getStepStyle(step.type);
          const isLast = idx === steps.length - 1;
          const isActive = isLast && isWorking;
          const isMilestone = step.message.includes("INPUT") || step.message.includes("RESPONSE") || step.message.includes("FINAL");
          const isRawOpen = showRawSteps[idx] || isDeveloperMode;
          const hasData = step.args !== undefined || step.result !== undefined;

          return (
            <div
              key={idx}
              className={`relative z-10 animate-in fade-in slide-in-from-left-4 duration-500 ease-out`}
            >
              <div className="flex gap-4">
                {/* ICON NODE */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                    isActive
                      ? "bg-[#D97757] border-[#D97757] shadow-[0_0_15px_rgba(217,119,87,0.3)] scale-110"
                      : isMilestone
                        ? "bg-white border-[#333333] shadow-sm"
                        : "bg-white border-[#E6E1D6] hover:border-[#A09B8E]"
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
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded border ${
                        isMilestone
                          ? "bg-[#333333] border-[#333333] text-white"
                          : `${style.bg} ${style.color} border-current border-opacity-20`
                      }`}
                    >
                      {style.tag}
                    </span>
                    <h4
                      className={`text-[12px] font-bold tracking-tight truncate ${
                        isMilestone ? "text-[#1A1A1A] text-[13px]" : "text-[#555555]"
                      }`}
                    >
                      {step.message}
                    </h4>

                    {hasData && !isDeveloperMode && (
                      <button
                        onClick={() => toggleRaw(idx)}
                        className={`ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border rounded-md transition-all cursor-pointer ${
                          isRawOpen
                            ? "bg-[#333333] border-[#333333] text-white"
                            : "border-[#E6E1D6] text-[#A09B8E] hover:border-[#333333] hover:text-[#333333]"
                        }`}
                      >
                        JSON
                      </button>
                    )}
                  </div>

                  <p
                    className={`text-[12px] leading-relaxed font-medium selection:bg-[#F0E6D6] ${
                      step.type === "ERROR" ? "text-red-500 font-bold" : "text-[#666666]"
                    } ${isMilestone ? "text-[#1A1A1A] font-bold" : ""}`}
                  >
                    {step.description}
                  </p>

                  {/* DATA DISPLAY (INLINE & COMPACT) */}
                  {isRawOpen && hasData && (
                    <div className="mt-3 animate-in fade-in zoom-in-95 duration-300">
                      <JsonCodeBlock
                        data={step.args || step.result}
                        label={step.args ? "Function Parameters" : "Execution Result"}
                        maxHeight="max-h-64"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ACTIVE PULSING DOT IF STILL WORKING */}
        {isWorking && (
          <div className="relative pl-11 py-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-[#D97757] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-[#D97757] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-[#D97757] rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] text-[#A09B8E] font-bold uppercase tracking-widest animate-pulse italic">
                Reasoning...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtLog;

