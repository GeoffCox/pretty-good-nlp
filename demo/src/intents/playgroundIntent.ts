import type { Intent } from "@geoffcox/pretty-good-nlp";

export const playgroundShared: Record<string, string[]> = {
  somePhrases: ["here are some", "shared phrases"],
  somePatterns: ["###-###", "###-###-####", "###-@@@-@@@@"],
  someRegularExpressions: ["\\w\\w", "[a-zA-Z]{0,4}"]
};

export const playgroundIntent: Intent = {
  name: "Playground",
  examples: [
    {
      name: "Name your intent here",
      parts: [
        {
          phrases: ["Add phrases", "you would like", "to recognize"],
          patterns: ["or patterns like phone numbers ###-###-####"],
          regularExpressions: ["or regular expressions like numbers: \\d+"],
        },
        {
          phrases: ["Add more parts to recognize with weights and variables"],
          weight: 2,
          variable: "variableNameHere",
        },
        {
          phrases: ["You can use shared parts for phrases", "$"],
          weight: 2,
          variable: "variableNameHere",
        },
      ],
      neverParts: [
        {
          phrases: [
            "You can also add never parts",
            "to zero the score",
            "when they match",
          ],
        },
      ],
    },
  ],
};
