import { Mistral } from "@mistralai/mistralai";
import { env } from "../config/env";
import {
  parsedIntentSchema,
  type ConversationMessage,
  type ParsedIntent,
} from "../types/intent";
import { buildRetryPrompt, buildSystemPrompt } from "./prompts/system";

export class MistralService {
  private client: Mistral;

  constructor() {
    this.client = new Mistral({ apiKey: env.MISTRAL_API_KEY });
  }

  /**
   * Transcrit un fichier audio (message vocal Telegram, .ogg/opus) en texte
   * via le modèle Voxtral de Mistral. La langue n'est pas imposée pour laisser
   * le modèle détecter le français/anglais automatiquement.
   */
  async transcribeAudio(
    content: Uint8Array | ArrayBuffer,
    fileName = "voice.ogg"
  ): Promise<string> {
    const response = await this.client.audio.transcriptions.complete({
      model: env.MISTRAL_TRANSCRIBE_MODEL,
      file: { fileName, content },
    });

    return response.text.trim();
  }

  async parseIntent(
    message: string,
    timezone: string,
    history: ConversationMessage[] = []
  ): Promise<ParsedIntent> {
    const systemPrompt = buildSystemPrompt(timezone);

    try {
      return await this.callAndParse(systemPrompt, message, history);
    } catch (firstError) {
      const errorMessage =
        firstError instanceof Error ? firstError.message : "Invalid JSON";
      try {
        return await this.callAndParse(
          systemPrompt,
          message,
          history,
          buildRetryPrompt(errorMessage)
        );
      } catch {
        return {
          intent: "unknown",
          title: null,
          description: null,
          date: null,
          time: null,
          period: null,
          priority: null,
          taskReference: null,
          timezone: null,
          language: null,
        };
      }
    }
  }

  private async callAndParse(
    systemPrompt: string,
    userMessage: string,
    history: ConversationMessage[],
    retryUserMessage?: string
  ): Promise<ParsedIntent> {
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage },
    ];

    if (retryUserMessage) {
      messages.push({ role: "user", content: retryUserMessage });
    }

    const response = await this.client.chat.complete({
      model: env.MISTRAL_MODEL,
      messages,
      temperature: 0,
      responseFormat: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Empty response from Mistral");
    }

    const raw: unknown = JSON.parse(content.trim());
    return parsedIntentSchema.parse(raw);
  }
}
