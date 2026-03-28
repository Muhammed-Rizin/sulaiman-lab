import { useState, useCallback, useRef, useEffect } from "react";
import { useAgent } from "./hooks/useAgent";
import AgentControl from "./components/AgentControl";
import ThoughtLog from "./components/ThoughtLog";
import AgentResponse from "./components/AgentResponse";
import JsonCodeBlock from "./components/JsonCodeBlock";
import ApiKeyModal from "./components/ApiKeyModal";
import { Plus, Settings, Terminal, MessageSquare } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

function App() {
  const { runAgent, clearSession, isWorking, steps, messages, rawContents } = useAgent();
  const [showRaw, setShowRaw] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420); // Slightly wider sidebar
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
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
    <div className="h-screen overflow-hidden flex bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#D97757]/20">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* MAIN CHAT COLUMN */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F6] relative">
        {/* FIXED HEADER */}
        <header className="h-16 w-full bg-[#FAF9F6]/90 backdrop-blur-md z-30 flex items-center justify-center border-b border-[#E6E1D6]/40 px-6 shrink-0 shadow-sm shadow-black/5">
          <div className="w-full max-w-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#333333] rounded-xl flex items-center justify-center overflow-hidden shadow-md shadow-black/5 ring-1 ring-black/5">
                <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A]">Sulaiman Lab</h1>
                <p className="text-[9px] text-[#A09B8E] uppercase tracking-[0.2em] font-bold opacity-80 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                  Advanced Reasoning Core
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 text-[#A09B8E] hover:text-[#333333] hover:bg-black/5 rounded-full transition-all cursor-pointer"
                title="API Settings"
              >
                <Settings size={18} strokeWidth={2.5} />
              </button>

              <div className="w-px h-4 bg-[#E6E1D6]/60 mx-1" />

              <button
                onClick={() => setShowRaw(!showRaw)}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border rounded-full transition-all cursor-pointer ${
                  showRaw
                    ? "bg-[#333333] border-[#333333] text-white shadow-lg shadow-black/10"
                    : "border-[#E6E1D6] text-[#A09B8E] hover:border-[#333333] hover:text-[#333333]"
                }`}
              >
                <Terminal size={12} />
                Raw Trace
              </button>

              <button
                onClick={handleNewThread}
                className="flex items-center gap-2 bg-white border border-[#E6E1D6] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#333333] hover:border-[#D97757]/40 hover:bg-[#FAF9F6] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus size={12} className="text-[#D97757]" strokeWidth={3} />
                Thread
              </button>
            </div>
          </div>
        </header>

        {/* INDEPENDENT SCROLL AREA */}
        <div
          className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 pt-16 pb-24"
          id="chat-scroll-container"
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col">
            {messages.length === 0 && !isWorking && (
              <div className="mt-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="w-16 h-16 bg-[#D97757]/10 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-[#D97757]/20">
                   <MessageSquare className="w-8 h-8 text-[#D97757]" strokeWidth={2} />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight text-[#1A1A1A]">
                  How can I help you <br />
                  <span className="italic text-[#D97757]">explore</span> today?
                </h2>
                <p className="text-[#A09B8E] max-w-sm mx-auto leading-relaxed text-sm font-medium">
                  Watch the agent's reasoning path unfold in real-time.
                  Perfect for understanding complex agentic workflows.
                </p>
              </div>
            )}

            {/* Conversation History */}
            <div className="flex flex-col space-y-2">
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
              <div className="mt-8 mb-12 animate-in zoom-in-95 duration-500">
                <JsonCodeBlock data={rawContents} label="Full System Content Trace" maxHeight="" />
              </div>
            )}
            
            {/* Typing Indicator */}
            {isWorking && messages.length > 0 && (
               <div className="flex items-center gap-3 py-6 animate-pulse">
                 <div className="w-2 h-2 bg-[#D97757] rounded-full animate-bounce" />
                 <span className="text-xs text-[#A09B8E] font-medium uppercase tracking-widest italic">
                   Reasoning...
                 </span>
               </div>
            )}
          </div>
        </div>

        {/* FIXED CONTROL BAR */}
        <div className="sticky bottom-0 bg-[#FAF9F6]/80 backdrop-blur-md border-t border-[#E6E1D6]/40 flex items-center z-30 shrink-0 py-6 pb-10">
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
        className="w-1 hover:w-1.5 bg-[#E6E1D6]/30 hover:bg-[#D97757]/40 cursor-col-resize transition-all z-40 active:bg-[#D97757] group relative"
      >
         <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize z-0" />
      </div>

      {/* REASONING SIDEBAR (ThoughtLog) */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col font-sans shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.03)] z-15 border-l border-[#E6E1D6]/50 overflow-hidden shrink-0 bg-[#FBF9F4]"
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ThoughtLog steps={steps} isWorking={isWorking} />
        </div>
      </aside>

      <AnimatePresence>
        {isApiKeyModalOpen && (
          <ApiKeyModal onClose={() => setIsApiKeyModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

