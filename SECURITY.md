# SECURITY & STANDARDS: Agent-React-Core (v1.0)

## 🛡️ Security Protocols

1.  **Environment Variable Sanitization:**
    - Ensure `VITE_GEMINI_KEY` is NEVER committed to Git.
    - Use `.env.local` for development and `.env.example` for documentation.
2.  **API Key Protection:**
    - Validate the API key exists before attempting any LLM call.
    - Gracefully handle `401 Unauthorized` errors with a UI notification.
3.  **Input Sanitization:**
    - Sanitize user input before sending it to the LLM to prevent prompt injection or broken JSON payloads.
4.  **Loop Safety (Anti-Spam):**
    - Strict `MAX_LOOPS` (current: 5) to prevent infinite loops and runaway API costs.

## ⚛️ React Best Practices (Vercel Standards)

1.  **State Locality:** Keep agent-running state (`isWorking`, `steps`) in a dedicated hook/context to minimize re-renders in the main layout.
2.  **Stable References:** Wrap `runAgent` in `useCallback` to prevent unnecessary re-renders of the `AgentControl` component.
3.  **Lazy State Initialization:** For heavy initial data (like loading chat history from `localStorage`), use the function form of `useState`.
4.  **Clean Effects:** Ensure `ThoughtLog` scroll effects are cleaned up and don't trigger multiple scroll events.
5.  **Component Splitting:** Separate "Thinking" logic (Hook), "Data" logic (Tools), and "UI" logic (Components).

## 📁 Git Governance

- **Ignore:** `.env`, `.env.local`, `node_modules/`, `dist/`, `.DS_Store`, `*.log`.

---

_Senior Architect's Directive: Build for security, optimize for performance._
