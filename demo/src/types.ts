import type { Intent } from "@geoffcox/pretty-good-nlp";

export type RecognizerStatus = "ready" | "waiting" | "recognizing";

export type DemoDocument = {
  name: string;
  intents: Intent[];
  shared?: Record<string, string[]>;  
};