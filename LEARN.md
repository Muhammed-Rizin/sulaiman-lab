# 📖 Learn: Sulaiman Lab

Welcome to the educational version of **Sulaiman Lab**! This project is designed to show you how "Reasoning Agents" work under the hood.

## 🔄 The Agentic Loop (Think-Act-Observe-Repeat)

Unlike a simple chatbot, a Reasoning Agent follows a specific lifecycle for every request:

1.  **STRATEGY (Think)**: The model analyzes your input and decides if it needs tools. It generates a "Thought" block explaining its logic.
2.  **ACTION (Act)**: If a tool is needed, the model sends a `functionCall` request. Our React hook (`useAgent.ts`) intercepts this and executes the local JS function.
3.  **OBSERVATION (Observe)**: The result of the JS function is passed back to the model as a `functionResponse`.
4.  **REPEAT**: The model reviews the data and decides if it needs more tools (Max 5 loops to prevent infinite cycles).
5.  **FINALIZE**: Once all evidence is gathered, the model synthesizes a beautiful Markdown response.

## ⚡ Parallelism in Action

In `useAgent.ts`, we implement **Parallel Tool Execution**. When the model requests multiple pieces of information (e.g., "What is the weather in Kochi and hotels in Munnar?"), we trigger them simultaneously:

```typescript
const toolResults = await Promise.all(
  functionCalls.map(async (fc) => {
    // Executes all tool calls in parallel...
  })
);
```

This ensures the agent is as fast as possible, avoiding the sequential "Async Waterfall" common in simpler implementations.

## 🛡️ Security Protocols

- **Loop Guard**: We enforce a `MAX_LOOPS` limit to prevent runaway API costs if the reasoning logic fails.
- **Key Sanitation**: The app checks for `VITE_GEMINI_KEY` presence before even attempting a call, showing a clear developer warning if missing.

## 🛠️ Adding Your Own Tools

You can extend the agent's capabilities in `src/lib/agent/tools.ts`:

1.  Define the function logic in `AGENT_TOOLS`.
2.  Add the formal definition to `TOOL_DEFINITIONS` so the model knows how to call it.

---

_Happy Learning with Sulaiman Lab!_
