import Anthropic from "@anthropic-ai/sdk";

// Lazy-init — never throws on import
let client: Anthropic | null = null;

export function getAiClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "AI features require ANTHROPIC_API_KEY. Configure it in your environment."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function isAiAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
