import { useState, useCallback, useRef, useEffect } from "react";
// LogStep is exported for use in ThoughtLog.tsx
import axios from "axios";
import { AGENT_TOOLS, TOOL_DEFINITIONS } from "../lib/agent/tools";

/**
 * --- ANTHROPIC-GRADE LOGGING ---
 * We now emit 'Rich Steps' (Structured Objects) instead of strings.
 */

import type { LogStep } from "./types";

export type { LogStep };

interface GeminiPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
  functionResponse?: {
    name: string;
    response: { result: unknown };
  };
}

interface GeminiContent {
  role: "user" | "model" | "function";
  parts: GeminiPart[];
}

const SYSTEM_INSTRUCTION = {
  role: "user",
  parts: [
    {
      text: `You are a highly proactive AI Agent. When asked about a topic you have a tool for, USE THE TOOL FIRST.

--- EVOLUTION: DEEP CHAIN OF THOUGHT ---
Before calling a tool, generate a 'Thought' block explaining your logic. 
Example: "The user is asking about Kerala destinations. I will first fetch the full registry of places to see what I can recommend, then I will fetch the weather for Kochi to provide a complete travel update."

Tool Context: When a tool returns data, explain what you have received and what you will do next.
Example: "I have received the list of places. I see Munnar is a hill station. I will now synthesize this for the user."

Always summarize all tool results beautifully in the final answer using Markdown.`,
    },
  ],
};

export const useAgent = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [steps, setSteps] = useState<LogStep[]>([]);
  const [contents, setContents] = useState<GeminiContent[]>([]);
  const contentsRef = useRef<GeminiContent[]>([]);

  // Sync ref with state to allow stable runAgent callback
  useEffect(() => {
    contentsRef.current = contents;
  }, [contents]);

  const addStep = (step: LogStep) => {
    setSteps((prev) => [...prev, step]);
    console.log(`[Turn ${step.turn}] ${step.type}: ${step.message}`);
  };

  const clearSession = () => {
    setSteps([]);
    setContents([]);
  };

  const runAgent = useCallback(async (userInput: string) => {
    setIsWorking(true);
    setSteps([]);

    const API_KEY = import.meta.env.VITE_GEMINI_KEY;

    if (!API_KEY) {
      addStep({
        turn: 0,
        type: "ERROR",
        message: "⚠️ CONFIGURATION ERROR",
        description:
          "VITE_GEMINI_KEY is missing from environment variables. Please check your .env.local file.",
      });
      setIsWorking(false);
      return;
    }

    const MODEL = "gemini-2.5-flash";
    // const MODEL = "gemini-3-flash-preview";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const currentContents: GeminiContent[] = [
      ...contentsRef.current,
      ...(contentsRef.current.length === 0 ? [SYSTEM_INSTRUCTION as GeminiContent] : []),
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
    setContents(currentContents);

    addStep({
      turn: 0,
      type: "THINKING",
      message: "📩 INPUT RECEIVED",
      description: `User intent captured: "${userInput}". Analyzing requirements and preparing the reasoning strategy.`,
    });

    let loopCount = 0;
    const MAX_LOOPS = 5;

    try {
      while (loopCount < MAX_LOOPS) {
        const turn = loopCount + 1;

        addStep({
          turn,
          type: "THINKING",
          message: "🧠 STRATEGY: Analyzing Request Path",
          description: `Scanning input for keywords to determine if autonomous tool execution [Turn ${turn}] is required for accuracy. The model is evaluating if internal registry data or real-time weather info is needed.`,
        });

        const response = await axios.post(URL, {
          contents: currentContents,
          tools: [{ function_declarations: TOOL_DEFINITIONS.map((t) => t.function) }],
          tool_config: { function_calling_config: { mode: "AUTO" } },
        });

        const candidate = response.data.candidates[0];
        const modelContent = candidate.content;

        currentContents.push({
          role: "model",
          parts: modelContent.parts,
        });
        setContents([...currentContents]);

        const functionCalls = modelContent.parts.filter((p: GeminiPart) => p.functionCall);

        if (functionCalls.length > 0) {
          addStep({
            turn,
            type: "TOOL_REQUEST",
            message: `🛠️ TOOL CALL: Selection [${functionCalls[0].functionCall.name}]`,
            description: `Intent detected. Triggering [${functionCalls[0].functionCall.name}] to pull structured data from the internal registry. This data will be used to contextualize the final answer.`,
          });

          const toolResults = await Promise.all(
            functionCalls.map(async (fc: GeminiPart) => {
              if (!fc.functionCall) return null;
              const { name, args } = fc.functionCall;

              addStep({
                turn,
                type: "EXECUTING",
                message: `🛠️ TOOL CALL: JS Engine Handoff`,
                description: `Dispatching ${name} to the Local Runtime. Action: ${name}. Parameters: ${Object.keys(args || {}).join(", ") || "none"}. This ensures the LLM operates on validated facts.`,
                name,
                args,
              });

              const toolFunction = AGENT_TOOLS[name as keyof typeof AGENT_TOOLS];
              if (toolFunction) {
                const result = await toolFunction(args as any);

                addStep({
                  turn,
                  type: "OBSERVATION",
                  message: "🔍 DATA OBTAINED",
                  description: `Successfully retrieved results from ${name}. This data provides the necessary evidence to proceed with the response synthesis.`,
                  name,
                  result,
                });

                return {
                  functionResponse: {
                    name: name,
                    response: { result },
                  },
                };
              }
              return null;
            })
          );

          const validResults = toolResults.filter((r): r is GeminiPart => r !== null);

          if (validResults.length > 0) {
            currentContents.push({
              role: "function",
              parts: validResults,
            });
            setContents([...currentContents]);
          }

          loopCount++;
        } else {
          addStep({
            turn,
            type: "COMPLETED",
            message: "Reasoning Resolution",
            description:
              "No further tool dependencies found. Synthesizing final response based on collected evidence.",
          });
          break;
        }
      }

      const totalToolCalls = currentContents
        .filter((c) => c.role === "function")
        .reduce((sum, c) => sum + c.parts.length, 0);

      addStep({
        turn: loopCount + 1,
        type: "COMPLETED",
        message: "✅ FINAL RESPONSE READY",
        description: `Reasoning concluded. Successfully processed the request in ${loopCount + 1} stages using ${totalToolCalls} tool(s). Delivering final answer.`,
      });

      if (loopCount >= MAX_LOOPS) {
        addStep({
          turn: MAX_LOOPS,
          type: "ERROR",
          message: "Loop limit reached",
          description: "The agent stopped to prevent an infinite reasoning cycle.",
        });
      }
    } catch (error: unknown) {
      let errorMsg = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.error?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      addStep({
        turn: loopCount + 1,
        type: "ERROR",
        message: "Network/Model Error",
        description: errorMsg,
      });
      console.error(error);
    } finally {
      setIsWorking(false);
    }
  }, []); // RunAgent is now stable

  const messages = contents
    .filter((c) => {
      // Filter out tool calls/responses for the main chat
      // Role: 'model' messages with tool calls should be hidden if they only contain tool calls
      // Role: 'function' (tool results) should always be hidden
      if (c.role === "function") return false;
      if (c.role === "model") {
        const hasToolCall = c.parts.some((p) => p.functionCall);
        // If it's pure tool call (no text), hide it.
        // If it has text + tool call, we might want to hide it too or just show the text part.
        // The user said: "Do NOT render role: model messages that contain tool_calls in the main chat. Keep those for the Sidebar only."
        if (hasToolCall) return false;
      }
      // Keep everything else (User input and Final Assistant Response)
      return true;
    })
    .map((c) => ({
      role: c.role === "model" ? "assistant" : "user",
      content: c.parts
        .map((p) => p.text || "")
        .join("\n")
        .trim(),
    }))
    .filter((m) => m.content !== ""); // Remove empty messages after filtering parts

  return {
    runAgent,
    clearSession,
    isWorking,
    steps,
    messages: messages as { role: string; content: string }[],
    rawContents: contents,
  };
};
