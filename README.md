# pretty-good-nlp

A simple natural language processing (NLP) recognizer you can use in minutes.

## Recognizing Intent

Let's say you are writing a home automation application. You want the app to respond to user input and take action. For example, the user might say `Turn on the oven to 450 degrees for 2 hours`. The app should recognize the user's _intention_ to turn on the oven. It should also extract the temperature and duration.

There are many different ways a user might express the same intent.

- `Turn on the oven to 450 degrees for 2 hours`
- `I want to heat the oven to 450 degrees and bake for 2 hours.`
- `Please bake for 2 hours at 450 degrees.`
- `Bake at 450 for 120 minutes`

Correctly recognizing the multitude of possible expressions needs sophisticated natural language processing (NLP) and an accurate machine learning (ML) model. Building these systems requires significant expertise, large labeled data sets, and many days of effort. The cost is multipled because each intent likely needs it own model. The side quest of building machine learning models might take so long, you never get back to the main quest of building your app. **Yikes!**

## Pretty-good-nlp to the rescue

- Get basic recognition working in minutes.
- Extract values from the text to named variables.
- Fast, deterministic, and debuggable algorithm.
- No machine learning or NLP knowledge required.
- No external dependencies.

> Bonus: Bookend your machine learning model

- When you get to the point that you do need machine learning, you can use the data you've already captured for labeled examples, dictionary features, and patterns.
- If you have a machine learning model but don't get a 100% score for the exact match cases, you can leverage this recognizer either pre- or post-prediction.

## Basic Usage

### Installation

```
npm install @geoffcox/pretty-good-nlp
```

### Creating an Intent

The `Turn on the oven to 450 degrees for 2 hours` example will help demonstrate building an intent to pass to the recognizer. The steps below will take you through creating example parts, examples, and then an intent.

1. Define the parts that should match in order to recognize this example.

```
Turn on the oven | to | 450 | degrees | for | 2 | hours
```

In the ExamplePart type, we can define:

- phrases like `Turn on`, `the oven`, and `degrees`
- patterns like `###` for the temperature
- regular expressions like `\\d+` for the hours

Phrases are string literals that are case-insensitive matched. Patterns are a simpler way to write a regular expression. Regular expressions let you define sophsticated pattern matching. If needed, an ExamplePart can have phrases, patterns, and regular expressions.

```ts
const parts: ExamplePart[] = [
  { phrases: ["Turn on the oven"] },
  { phrases: ["to"] },
  { patterns: ["###"] },
  { phrases: ["degrees"] },
  { phrases: ["for"] },
  { regularExpressions: ["\\d+"] },
  { phrases: ["hours"] },
];
```

2. Define a variable name in each part that should be extracted.

In this example, the temperature, temperatureUnit, duration, and durationUnit should be extracted. If they match, the recognizer will return them in a name/value dictionary.

```ts
const parts: ExamplePart[] = [
  { phrases: ["Turn on the oven"] },
  { phrases: ["to"] },
  { patterns: ["###"], variable: "temperature" },
  { phrases: ["degrees"], variable: "temperatureUnit" },
  { phrases: ["for"] },
  { regularExpressions: ["\\d+"], variable: "duration" },
  { phrases: ["hours"], variable: "durationUnit" },
];
```

3. Set a weight on a part that should be relatively more or less important than other parts. A weight of zero indictes an optional part. The default is 1.

In this example, knowing the temperature is very important, the duration moderately important, and `to` and `for` can be completely optional.

```ts
const parts: ExamplePart[] = [
  { phrases: ["Turn on the oven"] },
  { phrases: ["to"], weight: 0 },
  { patterns: ["###"], variable: "temperature", weight: 4 },
  { phrases: ["degrees"], variable: "temperatureUnit" },
  { phrases: ["for"], weight: 0 },
  { regularExpressions: ["\\d+"], variable: "duration", weight: 2 },
  { phrases: ["hours"], variable: "durationUnit" },
];
```

4. Fill out your example parts to cover different variations. Add alternative phrases, word synonyms, and patterns/regular expressions.

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
    weight: 4,
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
    weight: 2,
  },
  {
    phrases: ["hours", "minutes"],
    variable: "durationUnit",
  },
];
```

5. Define an example.

An example is an ordered set of parts to match. You can name it to help with debugging.

Here's a few of ways to name this example:

- `Turn on the oven to 450 degrees for 2 hours`
- `Turn on the oven to <temperature> degrees for <duration> hours`
- `<Turn on oven command> [to] <temperature> <temperatureUnit> [for] <duration> <durationUnit>`

There is also a collection of neverParts. Never parts allow you to specify things that shouldn't show in the example. If any never part matches then the entire example is considered a non-match and gets a recognition score of 0.

```ts
const example: Example = {
  name: "Turn the oven on to 450 degrees for 2 hours",
  parts: [
    // TODO: Put the parts you define here.
  ],
  neverParts: [],
};
```

Each example acts as an overall sentence structure to match. Remember there are lot of ways a user might express an intent. You probably want to create an example for each variation. Here are the variations from earlier.

- `Turn on the oven to 450 degrees for 2 hours`
- `I want to heat the oven to 450 degrees and bake for 2 hours.`
- `Please bake for 2 hours at 450 degrees.`
- `Bake at 450 for 120 minutes`

These can be handled in a single example because the sentence structure is the same. Something like `Start baking at 10 AM for 2 hours at 325 degrees` would required a new example.

6. Define an intent.

An intent is a just a named set of examples.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [
      //TODO: Put the examples you define here.
    ];
}
```

### Calling recognize()

The recognize method takes the text to recognize, the intent you created, and some options. The options are covered later in the advanced usage section.

```ts
function recognize(
  text: string,
  intent: Intent,
  options?: RecognizeOptions
): IntentRecognition;
```

Recognize returns an IntentRecognition. 
It has the name of the intent, a recognition score, and a dictionary of extracted variable name/values. 
There is also a details object that contains more information specific to this recognizer.

```ts
export type IntentRecognition = {
  name: string;
  score: number;
  variableValues: Record<string, string[]>;
  details: {
    examples: ExampleRecognition[];
    textTokenMap: TokenMap;
  };
```

How scoring works:
- The recognition score for the intent is the highest example recognition score. 
- The score will be between 0 (not recognized) and 1 (exactly recognized) inclusive.
- Each example recognition is scored by a ratio of the actual/expected part matches. 
  - The score is adjusted based on the relative weight of each part.
  - There is a deduction if the matches are out of order up to a maximum of 0.15.
  - There is also a deduction for noise (i.e. words in the text that are not matched) up to a maximum of 0.05.

About variable values:
- The variable values will contain the variables extracted for the higest scoring example.
- Sometimes there are multiple possible matches for a variable. In this case there will be more than one value in the values array.
- The values array associated with each varaible name will be in order from best to worst match.

About details:
- The example recognitions are in the same order as the examples in the intent.
- Each example recognition can be inspected to review the example's name, score, recognized parts, recognized never parts, and some metrics from the scoring process.
- The text token map can be inspected to review the input text and the tokens from tokenization. Tokenization is breaking up the input text into words.

## Advanced Usage

Pass an options parameter to the recognize method to handle advanced scenarios.

### Share phrases, patterns, and regular expressions

Use the shared property to specify named sets of phrases, patterns, and regular expressions to use across intents and examples. 

```ts
const options = {
  shared: {
    temperatureUnits: ['fahrenheit', 'celcius', 'kelvin'],
    timeDurations: ['hours', 'minutes'],
    datePatterns: ['####-##-##','##/##/##','##-####'],
    timeRegexs: ['\\d\\d:\\d\\d', '\\d+']
  }
};
```
You can then include them into example parts by reference.

```ts
const part : ExamplePart = {
  // This resolves to ['degrees', fahrenheit', 'celcius', 'kelvin']
  phrases: ['degrees', '$ref=temperatureUnits']
}
```

### Tune the out of order and noise penalties

Set the maxOutOfOrderPenalty or maxNoisePenalty to control how severe the penalties are when scoring examples. Values must be between 0 and 1 inclusive.

```ts
const options = {
  maxOutOfOrderPenalty: 0.2,
  maxNoisePenalty: 0    
};
```

### Using a different tokenizer

The tokenize method takes a string of text and returns a TokenMap. A TokenMap is the original text and an array of character ranges with one range per token.

```ts
export type Tokenizer = (text: string) => TokenMap;
```

You can implement a tokenizer to separate words based on a particular language, or if you want to break on different delimiters.  The default tokenizer breaks up words based on ' .,:;' (i.e. space, period, comma, colon, semicolon, question mark, and exclamation point). Pass your tokenizer in the options.

```ts
const options = {
  tokenizer: myTokenizer,  
};
```


