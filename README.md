# pretty-good-nlp

A programmable and deterministic natural language processing (NLP) recognizer.

## Recognizing Intent

Let's say you are writing a home automation application. You want the app to respond to user input and take action. For example, the user might say `Turn on the oven to 450 degrees for 2 hours`. The app should recognize the user's _intention_ to turn on the oven. It should also extract the temperature and duration.

There are many different ways a user might express the same intent.

- `Turn the oven on to 450 degrees for 2 hours`
- `I want to heat the oven to 450 degrees and bake for 2 hours.`
- `Please bake for 2 hours at 450 degrees.`
- `Bake at 450 for 120 minutes`

To correctly recognize any of the multitude of different expressions requires sophisticated natural language processing (NLP) and an accurate machine learning (ML) model. These systems can be very difficult to build and time-consuming properly train.

They often require considerable expertise in data science, NLP, and machine learning algorithms. Getting an accurate model requires thousands to millions of labeled examples that cover the variety of possible expressions. You also need to build features to identify the different parts of the each example.

Your app might need to recognize many different intents (e.g. `Turn off the oven at 4pm`, `Preheat the oven to 325 then let me know`). Each intent likely requires building a separate model.

The side quest of building machine learning models might take so long, you never get back to the main quest of building your app. **Yikes!**

## Pretty-good-nlp to the rescue

- Get basic recognition working in minutes.
- Extract values from the text to named variables.
- Fast, deterministic, and debuggable algorithm.
- No machine learning or NLP knowledge required.
- No external dependencies.

> Bonus: When you get to the point that you do need machine learning, you can leverage the configuration you've done as labeled examples, dictionary features, and patterns.

# Usage

1. For each intent you want to recognize, create an Intent. Each intent is contains an Example array.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [];
}
```

2. Add examples to your intent. Each example contains ExamplePart arrays; parts and neverParts. Part are an ordered set of things to look for to recognize your example. We'll cover never parts later.

```ts
// Of course you can declare the entire Intent at once.
// Creating an example and pushing it onto the array is just for ease of writing this doc.
const example: Example = {
  name: "Turn the oven on to 450 degrees for 2 hours",
  parts: [],
  neverParts: [],
};

intent.examples.push(example);
```

3. Add parts to your example. Parts can be phrases, patterns, or regular expressions.

- Phrases are a collection of strings that are used to case-insensitive match the text.
- Patterns are a collection of simple syntax that is a little easier than writing regular expressions.
- Regular expressions are a collection of regular expressions.

```ts
// This is wildly simplified.
const parts: ExamplePart[] = [
  {
    phrases: ["Turn on the oven to"],
  },
  {
    patterns: ["### degrees"],
  },
  {
    phrases: ["for"],
  },
  {
    regularExpressions: ["\\d+ hours"],
  },
];

example.parts.push(...parts);
```

4. Determine which parts you would like to extract and choose a variable name for them. When a part matches, the matched value will be returned as the variable value.

```ts
const parts: ExamplePart[] = [
  {
    phrases: ["Turn on the oven to"],
  },
  {
    patterns: ["### degrees"],
    variable: "temperature",
  },
  {
    phrases: ["for"],
  },
  {
    regularExpressions: ["\\d+ hours"],
    variable: "duration",
  },
];
```

5. Use weights to increase or decrease the importance of different parts. The default weight is 1. A part with a weight of 2 will be twice as important. If a part is optional, set the weight to 0.

```ts
const parts: ExamplePart[] = [
  {
    phrases: ["Turn on the oven to"],
    weight: 1,
  },
  {
    patterns: ["### degrees"],
    variable: "temperature",
    weight: 2,
  },
  {
    phrases: ["for"],
    weight: 0,
  },
  {
    regularExpressions: ["\\d+ hours"],
    variable: "duration",
    weight: 0.5,
  },
];
```

6. Iteratively improve your examples.

Brainstorm the other ways people might express the same example or other examples of the same intent. You'll need to spend a little time factoring examples into their parts to get the best accuracy and extract the right value.

```ts
const parts: ExamplePart[] = [
  {
    phrases: [
      "Oven on",
      "Turn on the oven",
      "Turn the oven on",
      "Start the oven",
      "Bake at",
      "Set the oven",
    ],
  },
  {
    phrases: ["to", "at", "for"],
    weight: 0,
  },
  {
    patterns: ["###"],
    variable: "temperature",
  },
  {
    phrases: ["degrees", "fahrenheit", "celcius"],
    weight: 0.5,
    variable: "temperatureUnit",
  },
  {
    phrases: ["for", "lasting", "ending after", "no more than"],
    weight: 0,
  },
  {
    regularExpressions: ["\\d+"],
    variable: "duration",
  },
  {
    phrases: ["hours", "minutes"],
    variable: "durationUnit",
  },
];
```

> As you create more examples, it is common to put a pattern into their name.

```ts
const example: Example = {
  name: "<Oven on> to <temperature> <temperatureUnit> for <duration> <durationUnit>",
  //...
};
```
