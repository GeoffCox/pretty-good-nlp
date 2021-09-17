import type { Intent } from "@geoffcox/pretty-good-nlp";


export type DemoDocument = {
  name: string;
  intents: Intent[];
  shared?: Record<string, string[]>;
  //TODO: instructions/overview
};