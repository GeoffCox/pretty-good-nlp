# pretty-good-nlp
A programmable and deterministic natural language processing (NLP) recognizer.


# Usage

## Recognizing Intent

Let's say you are writing a home automation application. You want the app to respond to user input and take action. For example, the user might say `Turn on the oven to 450 degrees for 2 hours`. The app should recognize the user *intention* to turn on the oven.  It should also extract the temperature and duration.

There are many different ways a user might express the same intent. 
- `Turn the oven on to 450 degrees for 2 hours`
- `I want to heat the oven to 450 degrees and bake for 2 hours.`
- `Please bake for 2 hours at 450 degrees.`
- `Bake at 450 for 120 minutes`

To recognize the multitude of different expressions and correctly identify the user's intention requires sophisticated natural language processing (NLP) and an accurate machine learning (ML) model. These systems can be very difficult to build and time-consuming properly train. 

They often require considerable expertise in data science, NLP, and machine learning algorithms. Getting an accurate model requires thousands to millions of labeled examples that cover the variety of possible expressions. You also need to build features to identify the different parts of the each example.

Your app might need to recognize many different intents (e.g. `Turn off the oven at 4pm`, `Preheat the oven to 325 then let me know`). Each intent likely requires building a separate model.

The side quest of building machine learning models might take so long, you never get back to the main quest of building your app. Yikes! 

Pretty-good-nlp was built to help:
- You get your app doing basic recognition in under and hour. The algorithm is deterministic, debuggable, and requires no NLP nor machine learning. Use it to work through the expected expressions your app needs to handle.
- You get a jump start for later when you move to machine learning. The examples you define for pretty-good-nlp capture the inputs to training a machine learning model. There are intents containing labeled examples. The examples are made up of ordered parts (i.e. patterns). There are also sets of phrases, patterns, and regular expressions (i.e. dictionary and pattern features). 
- You get something to help tune your machine learning model post prediction. Machine learning models are not always deterministic. You can use the pretty-good-nlp recognizer to correct any problems with your model or even short-cut for well-known examples.


