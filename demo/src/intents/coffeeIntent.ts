import type { Intent } from "@geoffcox/pretty-good-nlp";

export const coffeeYaml = "Name: Add coffee drink\
Examples:\
- CanonicalForm: I want a grande vanilla latte\
  Parts:\
  - Phrases:\
    - Could I have\
    - I would like\
    - I'd like\
    - I'd love\
    - Please    \
    - Please give me\
    - Please make me\
    - make me\
    - give me\
    - I will have\
    - I'll have\
    - I want\
    - Make\
    - Brew\
  - Phrases:\
    - a\
    - one\
    - two\
    - three\
    - four\
    - five\
    - six\
    RegularExpressions:\
    - \d+\
    Variable: quantity\
  - Phrases:\
    - short\
    - tall\
    - grande\
    - venti\
    - small\
    - medium\
    - large\
    - extra large\
    - 8 ounce\
    - 8 oz\
    - 12 ounce\
    - 12 oz\
    - 16 ounce\
    - 16 oz\
    - 20 ounce\
    - 20 oz\
    Variable: size\
  - Phrases:\
    - vanilla\
    - hazelnut\
    - caramel\
    - raspberry\
    Variable: flavor\
    Weight: 0\
  - Phrases:\
    - espresso\
    - espressos\
    - latte\
    - lattes\
    - americano\
    - americanos\
    - cappuccino\
    - cappuccinos\
    - macchiato\
    - macchiatos\
    - mocha\
    - mochas\
    - drip\
    - drips\
    - drip coffee\
    - drip coffees\
    - coffee\
    - coffees\
    - brewed coffee\
    - brewed coffees\
    Variable: product";

export const coffeeIntent: Intent = {
  name: "Add coffee drink",
  examples: [
    {
      name: "<order intent> [quantity] <size> [flavor] [temp] <drink>",
      parts: [
        {
          phrases: [
            "Could I have",
            "I would like",
            "I\'d like",
            "I'd love",
            "Please",
            "Please give me",
            "Please make me",
            "Make me",
            "Give me",
            "Gimme",
            "I will have",
            "I'll have",
            "I want",
            "Make",
            "Brew",
            "Add",
            "Plus",
          ],
        },
        {
          phrases: ["a", "one", "two", "three", "four", "five", "six"],
          regularExpressions: ["\\d+"],
          variable: "quantity",
          weight: 0,
        },
        {
          phrases: [
            "short",
            "tall",
            "grande",
            "venti",
            "small",
            "medium",
            "large",
            "extra large",
            "8 ounce",
            "8 oz",
            "12 ounce",
            "12 oz",
            "16 ounce",
            "16 oz",
            "20 ounce",
            "20 oz",
          ],
          variable: "size",
        },
        {
          phrases: ["vanilla", "hazelnut", "caramel", "raspberry"],
          variable: "flavor",
          weight: 0,
        },
        {
          phrases: [
            "hot",
            "cold",
            "iced",
            "extra hot",
            "room temperature",
            "tepid",
          ],
          variable: "temperature",
          weight: 0,
        },
        {
          phrases: [
            "cocoa",
            "espresso",
            "espressos",
            "latte",
            "lattes",
            "americano",
            "americanos",
            "cappuccino",
            "cappuccinos",
            "macchiato",
            "macchiatos",
            "mocha",
            "mochas",
            "drip",
            "drips",
            "drip coffee",
            "drip coffees",
            "coffee",
            "coffees",
            "brewed coffee",
            "brewed coffees",
          ],
          variable: "product",
        },
      ],
      neverParts: [
        {
          phrases: [
            "don't",
            "do not",
            "won't",
            "will not",
            "cancel",
            "nevermind",
          ],
        },
      ],
    },
  ],
};