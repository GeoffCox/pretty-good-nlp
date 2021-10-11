# @geoffcox/pretty-good-nlp package

Pretty-good-nlp is a deterministic, match-based, recognizer for natural language processing (NLP) scenarios.

This readme covers installation and usage. 
You can read about the NLP concepts in the [repository readme](https://github.com/GeoffCox/pretty-good-nlp).

## Installation

```
npm install @geoffcox/pretty-good-nlp
```

## Basic Usage

### 1. Define an intent

An intent made up of a set of examples.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [];
};
```

### 2. Add examples to your intent

Each example consists of an ordered set of parts to match.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [
        {
            name: "Turn the oven on to 450 degrees for 2 hours",
            parts: [],                
        },
        //...
    ];
};
```
### 3. Add parts to your example

Add the parts in the order you expect them to be in the example. 
Each part can have literal phrases, patterns, and/or regular expressions.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [
        {
            name: "Turn the oven on to 450 degrees for 2 hours",
            parts: [
                { phrases: ["Turn on the oven to"] },                
                { patterns: ["###"] },
                { phrases: ["degrees"] },
                { phrases: ["for"] },
                { regularExpressions: ["\\d+"] },
                { phrases: ["hours"] },
            ],            
        }
        //...
    ];
};
```

Of course, you would have more than one phrase in most parts. 
As you think of variations that fit within the example format, add them. 

```ts
phrases: ["Turn on the oven", "Turn the oven on", "Bake at", "Broil at"]
```

If you find a variation that doesn't fit, it might mean you need to define a new example.
If you find that you are covering too many permutations of a phrase, you might need to break it up into more parts.

### 4. Define a variable name in each part that should be extracted

When a part with a variable name matches, the matched text is extract and returned as the value for that variable.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [
        {
            name: "Turn the oven on to 450 degrees for 2 hours",
            parts: [
                { phrases: ["Turn on the oven to"] },
                { patterns: ["###"], variable: "temperature" },
                { phrases: ["degrees"], variable: "temperatureUnit" },
                { phrases: ["for"] },
                { regularExpressions: ["\\d+"], variable: "duration" },
                { phrases: ["hours"], variable: "durationUnit" },
            ],            
        }
        //...
    ];
};
```

### 5. Call recognize

The recognize method takes the text to recognize, the intent you created, and some options. 
The options are covered later in the advanced usage section.

```ts
function recognize(
text: string,
intent: Intent,
options?: RecognizeOptions
): IntentRecognition;
```

Recognize returns an `IntentRecognition`. 

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

## Advanced
### How scoring works

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

### Dealing with negatives

There are words that indicate the opposite of an intent. You can handle these cases by adding parts to the example using the `neverParts` property. If any of these part match then the example gets a score of 0.

```ts
const intent : Intent = {
    name: 'Turn on oven',
    examples: [
        {
            name: "Turn the oven on to 450 degrees for 2 hours",
            parts: [],
            neverParts: [
                { phrases: ["Don't", "Do not", "Cancel", "Stop", "Off"]}
            ],
        },
        //...
    ];
};
```

### Handling Importance

You can set options on an example part to indicate if it is more/less important than other parts. 

- You can weight a part relative to other parts. A weight of zero indictes an optional part. The default is 1.
- You can make a part required. If a required part is not found, the entire example gets a score of 0. 
- You can indicate that a part can appear in any order within the example.

    ```ts
    const intent : Intent = {
        name: 'Turn on oven',
        examples: [
            {
                name: "Turn the oven on to 450 degrees for 2 hours",
                parts: [
                    { phrases: ["Turn on the oven to"] },
                    { patterns: ["###"], variable: "temperature", weight: 4 },
                    { phrases: ["degrees"], variable: "temperatureUnit" },
                    { phrases: ["for"], weight: 0 },
                    { regularExpressions: ["\\d+"], variable: "duration", weight: 2 },
                    { phrases: ["hours"], variable: "durationUnit" },
                ],
                neverParts: [],
            }
            //...
        ];
    };
    ```

### Ignoring Order

Parts are expected to appear in order and the score is reduced for out of order parts. You can indicate that a part can appear in any order within the example by the `ignoreOrder` property.

```ts
//...
parts: [
    { phrases: "Please", ignoreOrder: true}
    //...
],
//...
```

### Sharing phrases, patterns, and regular expressions

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

### Tuning out of order and noise penalties

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