import OpenAI from "openai";

/**
 * DeepSeek V4-Pro through the OpenAI client. Master scope §11.
 *
 * The site MUST never depend on Anthropic, Fal, or any other LLM provider.
 * If OPENAI_API_KEY is missing, this throws — generation is gated, but the
 * site still runs (the cron will record `skipped` instead of failing).
 */

let _client: OpenAI | null = null;

export function getDeepseek(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set — writing engine disabled");
  }
  _client = new OpenAI({ apiKey, baseURL });
  return _client;
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || "deepseek-v4-pro";
}

export function isWritingEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.AUTO_GEN_ENABLED !== "false";
}
