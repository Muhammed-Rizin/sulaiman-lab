# 🔬 Sulaiman Lab (Core Reasoning AI Engine)

A premium, educational "Reasoning Lab" designed to visualize the internal logic of AI agents. Built with **React 19**, **Vite**, and **Google Gemini SDK**, this project implements modern agentic patterns like **Chain-of-Thought (CoT)**, **Parallel Tool Execution**, and **Vercel React Best Practices**.

![Sulaiman Lab Preview](https://github.com/user-attachments/assets/placeholder)

## 🚀 Key Features

- **🧠 Autonomous Reasoning**: Watch the AI "think" before it acts, with detailed strategy and logic traces.
- **🛠️ Parallel Tool Handoff**: Executes multiple tools (e.g., Weather + Search) concurrently using `Promise.all` to avoid waterfalls.
- **🔬 System Trace**: Toggle a full JSON dump of the model's conversation history (`system`, `user`, `model`, `function` roles).
- **🛡️ Security First**: Strict environment validation, loop guards, and robust error handling to prevent runaway API costs.
- **⚛️ Premium UI**: Crafted with an Anthropic-inspired aesthetic, featuring earthy tones, glassmorphism, and a timeline-based reasoning sidebar.

## 🛠️ Stack

- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (using `@layer components`)
- **Intelligence**: Google Gemini-2.5-Flash (or Gemini-3-Flash-Preview)
- **Icons**: Lucide React
- **Markdown**: React Markdown + Remark GFM

## 🏁 Quick Start

### 1. Prerequisites

- Node.js 18+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 2. Installation

```bash
git clone <repo-url>
cd sulaiman-lab
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
VITE_GEMINI_KEY=your_gemini_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

## 📖 Learning More

Check out [LEARN.md](./LEARN.md) for a deep dive into how "Reasoning Agents" work and how to extend the tool definitions.

## 📄 License

MIT
