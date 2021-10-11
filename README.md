# pretty-good-nlp

Pretty-good-nlp is a deterministic, match-based, recognizer for natural language processing (NLP) scenarios.

This readme cover the concepts, motivation, expected scenarios for building the pretty-good-nlp recognizer. For installation and usage, see the [package readme](https://github.com/GeoffCox/pretty-good-nlp/tree/main/package).

[Live Demo](https://geoffcox.github.io/demos/pretty-good-nlp/)

## Recognition is not easy

Let's say you are writing a home automation application. You want the app to respond to user input and take action. For example, the user might say `Turn on the oven to 450 degrees for 2 hours`. The app should recognize the user's _intention_ to turn on the oven. It should also extract the temperature and duration so you can use them to control the oven.

There are many different ways a user might express the same intent.

- `Turn on the oven to 450 degrees for 2 hours`
- `I want to heat the oven to 450 degrees and bake for 2 hours.`
- `Please bake for 2 hours at 450 degrees.`
- `Bake at 450 for 120 minutes`

Accurately recognizing the multitude of possible expressions requires sophisticated natural language processing (NLP) and machine learning (ML) models. 

Building these systems requires significant expertise, large labeled data sets, and week to months of effort. 

The costs are higher when each intent needs it own model. The side quest of building machine learning models might take so long, you never get back to the main quest of building your app. **Yikes!**

## Pretty-good-nlp to the rescue

This recognizer was created so you can get basic recognition working in a hour or two. No machine larning nor NLP knowledge is required. It is easy to improve as you develop your application.

The algorithm is fast and deterministic. It is easy to debug if you have problems. The package has no external dependencies on large datasets.

If you need a machine learning model, you can develop it in parallel with your application. The configuration passed to the recognizer was designed to be leveraged when building ML models. Examples with variables are positive labels. The phrases, patterns, and regular expressions can be converted to feature dictionaries. You could even use the permutations of each example's parts to generate a labeled dataset.

Once you have a machine learning model, you can augment it with this recognizer. If you run the recognizer pre-prediction, you can avoid the cost of the ML model for positive, exact matches. If you run the recognizer post-prediction, you can correct for non-deterministic deviations or small issues with precision and recall.

## Design considerations

### Short utterances

Short and simple sentences are the primary input for IoT devices, ordering systems, and chat bots. 

Accurate long document recognition is a massive undertaking. It is way beyond this simple recognizer to handle complex sequencing, look-ahead and back-tracking for context, format and relative position metadata, normalization, and data cleaning. Performance becomes a big factor in long documents for both computation and memory footprint.

This recognizer is built to examine short utterances and provide scores for multiple intents and examples. 

### Examples first

When describing what to recognize and what to reject, almost everyone starts by listing a set of positive examples and maybe a few negative examples. 

This recognizer's configuration was designed to allow developers to quickly enumerate a set of examples and break them down into their ordered parts. As more examples are considered, parts can be broken up and more phrases added to handle variations.

### Sentence ordering

Although humans can understand mixed up sentence structure (i.e. Yoda), order is often important in distinguishing intent. 'How to cook dinner for vegetarians' is very different than 'How to cook vegetarians for dinner'.

This recognizer includes ordering in its scoring calculation, but the penalty is capped. The maximum out-of-order penalty can be configured per recognize call.

### Deterministic

Machine learning models built with deep learning algorithm and millions of examples have a complex decision tree. This can make them nearly impossible to debug and there may be non-deterministic variations in complex predictions.

This recognizer is built to be deterministic and easy to debug. Each intent score equals it's best scoring example. Examples are scored based on the weighted matches of their parts. The scoring penalizes out-of-order, missing, or unexpected parts.

### Replaceable

Many developers will dismiss this as nothing more than simple text-based matching - which is completely accurate. This recognizer started as an array of exact match strings. It then supported regular expressions. Regular expressions seemed difficult so patterns were added. Then the literal match was replaced with phrase matching. Finally a simple scoring algorithm was added to account for partial part matching, noise, and ordering. 

There is deliberately no magic here. This recognizer was built to be replaced. The goal is to have a placeholder for sophisticated regular expressions. Its value is in the effort required to add each feature, fully unit test, define a configuration format, and return a useful result.

### Fast matching

A recognizer will have to consider multiple intents, each with multiple parts, and each with multiple phrases. Dictionaries of phrases can easily get large enough to impact the performance of an iterative complete match algorithm. 

This recognizer employs a Trie search algorithm to quickly match sequences of words against phrase lists.

### Pattern recognition

Sometimes a part cannot be recognized by a set of literals.  For example, a list of every possible calendar date would be impractical. Regular expressions are very powerful in pattern recognition, but equally as difficult to construct. 

This recognizer provides a simplified pattern language which is converted into regular expressions. For example, a phone number pattern could be `#-###-###-####`. Full regular expressions are supported as well.

### Noise

Text input captured from speech recognition or casual conversation typing in chat bots may have significant noise words or unmatched words. 

This recognizer can effectively remove noise words by marking a part as weight zero and ignoring order. Noise words are included in the scoring calculation, but the penalty is capped. The maximum noise penalty can be configured per recognize call.

### Client and Server

To support rapid development, this recognizer was built in Typescript/JavaScript so that it could run in web browsers. The recognizer is built as a single function `recognize` that would allow for background web workers to do heavy lifting in client scenario. As well, the recognizer could be used on a node server when chained with a machine learning model.