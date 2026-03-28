export interface LogStep {
  turn: number;
  type:
    | "THINKING"
    | "TOOL_REQUEST"
    | "EXECUTING"
    | "OBSERVATION"
    | "COMPLETED"
    | "ERROR"
    | "SUMMARY";
  message: string;
  description: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: unknown;
}
