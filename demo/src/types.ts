import type { Intent } from "@geoffcox/pretty-good-nlp";


export type DemoExample = {
  name: string;
  intents: Intent[];
  shared?: Record<string, string[]>;
  //TODO: instructions/overview
};