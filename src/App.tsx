import { useState, useCallback, useRef, useEffect } from "react";
import { useAgent } from "./hooks/useAgent";
import AgentControl from "./components/AgentControl";
import ThoughtLog from "./components/ThoughtLog";
import AgentResponse from "./components/AgentResponse";
import JsonCodeBlock from "./components/JsonCodeBlock";
import { Plus, Sparkles } from "lucide-react";

function App() {
  const { runAgent, clearSession, isWorking, steps, messages, rawContents } = useAgent();
  const [showRaw, setShowRaw] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(384); // Default w-96
  const isResizing = useRef(false);

  const handleNewThread = () => {
    if (
      window.confirm("Start a new learning thread? This will clear the current reasoning path.")
    ) {
      clearSession();
    }
  };

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="h-screen overflow-hidden flex bg-[#F7F4EF] text-[#333333] selection:bg-[#D97757]/10">
      {/* MAIN CHAT COLUMN */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F7F4EF] relative">
        {/* FIXED HEADER */}
        <header className="h-16 w-full bg-[#F7F4EF]/80 backdrop-blur-md z-30 flex items-center justify-center border-b border-[#E6E1D6]/60 px-6 shrink-0">
          <div className="w-full max-w-2xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 bg-[#D97757] rounded-[10px] flex items-center justify-center text-white shadow-lg shadow-[#D97757]/10">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold tracking-tight">Sulaiman Lab</h1>
                <p className="text-[8px] text-[#A09B8E] uppercase tracking-[0.2em] font-bold opacity-70">
                  Core Agent Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className={`text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 border rounded-full transition-all ${
                  showRaw
                    ? "bg-[#333333] border-[#333333] text-white"
                    : "border-[#E6E1D6] text-[#A09B8E] hover:border-[#D97757]/30"
                }`}
              >
                System Trace
              </button>

              <button
                onClick={handleNewThread}
                className="flex items-center gap-2 bg-white border border-[#E6E1D6] px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-[#333333] hover:border-[#D97757]/50 hover:bg-[#F7F4EF] transition-all shadow-sm"
              >
                <Plus className="w-2.5 h-2.5 text-[#D97757]" />
                New Thread
              </button>
            </div>
          </div>
        </header>

        {/* INDEPENDENT SCROLL AREA */}
        <div
          className="overflow-y-auto scrollbar-thin px-6 md:px-12 pt-12 pb-12"
          style={{ height: "calc(100vh - 128px)" }}
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col">
            {messages.length === 0 && !isWorking && (
              <div className="mt-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h2 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
                  How can I help you <br />
                  <span className="italic text-[#D97757]">explore</span> today?
                </h2>
                <p className="text-[#A09B8E] max-w-sm mx-auto leading-relaxed font-sans text-sm">
                  Interact with the agent and watch its reasoning path unfold in the sidebar.
                  Perfect for learning agentic logic.
                </p>
              </div>
            )}

            {/* Conversation History */}
            <div className="flex flex-col">
              {messages.map((m, idx) => (
                <AgentResponse
                  key={idx}
                  response={m.content}
                  role={m.role as "user" | "assistant"}
                  isVisible={true}
                />
              ))}
            </div>

            {/* SYSTEM DUMP VIEW (Toggleable) */}
            {showRaw && (
              <div className="mt-6 mb-8 animate-in zoom-in-95 duration-500">
                <JsonCodeBlock data={rawContents} label="Full System Content Trace" maxHeight="" />
              </div>
            )}
          </div>
        </div>

        {/* FIXED CONTROL BAR */}
        <div className="min-h-16 bg-[#F7F4EF] border-t border-[#E6E1D6] flex items-center z-30 shrink-0 py-4">
          <div className="w-full max-w-2xl mx-auto px-6">
            <AgentControl
              onRun={runAgent}
              isWorking={isWorking}
              hasMessages={messages.length > 0}
            />
          </div>
        </div>
      </main>

      {/* RESIZE HANDLE */}
      <div
        onMouseDown={startResizing}
        className="w-1 bg-[#E6E1D6]/20 hover:bg-[#D97757]/40 cursor-col-resize transition-colors z-40 active:bg-[#D97757]"
      />

      {/* REASONING SIDEBAR (ThoughtLog) */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col font-sans shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.02)] z-15 border-l border-[#E6E1D6] overflow-hidden shrink-0"
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ThoughtLog steps={steps} isWorking={isWorking} />
        </div>
      </aside>
    </div>
  );
}

export default App;
