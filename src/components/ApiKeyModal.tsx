import React, { useState } from "react";
import { X, Eye, EyeOff, Trash2, ExternalLink, Key } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface ApiKeyModalProps {
  onClose: () => void;
}

const STORAGE_KEY = "gemini-api-key";

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || "");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(() => !!localStorage.getItem(STORAGE_KEY));

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      setIsSaved(true);
      toast.success("API Key saved successfully");
      onClose();
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setIsSaved(false);
    toast.success("API Key removed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-[#E6E1D6]/50"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A09B8E] hover:text-[#333333] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#D97757]/10 rounded-xl flex items-center justify-center text-[#D97757]">
            <Key size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#333333] tracking-tight">API Configuration</h2>
            <p className="text-[#A09B8E] text-[11px] font-medium">
              Stored locally in your browser.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#A09B8E]">
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-[#D97757] hover:underline uppercase tracking-tight"
              >
                Get Key <ExternalLink size={10} />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full bg-[#F7F4EF] border border-[#E6E1D6] rounded-xl px-4 py-3 pr-12 text-sm font-mono focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09B8E] hover:text-[#333333] transition-colors cursor-pointer"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              disabled={!apiKey}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#A09B8E] hover:text-red-500 transition-colors cursor-pointer disabled:opacity-30"
            >
              <Trash2 size={14} />
              Clear Key
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-8 py-3 bg-[#333333] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
            >
              {isSaved ? "Update Key" : "Save Configuration"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiKeyModal;
