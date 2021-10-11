<!--
  @component
  Instructions for the demo.
-->
<div class="instructions">
    <h1>Welcome!</h1>
    <p>This demonstrates the <a href="https://github.com/GeoffCox/pretty-good-nlp" target="_blank">pretty-good-nlp</a> recognizer.</p>
    <h2>Intents</h2>
    <p>
      On the left you can choose from one of the intent documents. Whichever tab
      you select becomes the active document for recognition.
    </p>
    <ul>
      <li>
        <b>Coffee Order</b> demonstrates a single basic intent.
      </li>
      <li>
        <b>Vacation</b> demonstrates multiple intents that share phrases, patterns, and regular expressions.
      </li>
      <li>
        <b>Playground</b> provides a starting point for writing your own intents.
      </li>
    </ul>    
    <p>
      The top pane contains the list of intents. Each intent is made up of a
      list of examples. Each example is a list of parts. A part can have phrases,
      patterns, and/or regular expressions.
    </p>
    <p>You can edit any of the intent documents to try and make them better.</p>
    <p>
      The bottom pane contains the shared phrases, patterns, and regular
      expressions for the current document. Shared items can be used by multiple
      intents in the document using the $ref= expression.
    </p>
    <h2>Recognition</h2>
    <p>On the right you can try out how an intent is recognized.
        Type something into the text box above and the recognizer will run using the currently selected intent document.
    </p>
    <p>If you want to see these instructions again, clear the text box above.</p>
    <p>
        For each intent, this pane will show recognition results.  
        These will include the results of the matches and scoring for each example.
    </p>    
</div>

<style>
  .instructions {
    padding: 20px;
    max-width: 900px;
    margin: auto;
  }

  .instructions ul li {
    margin-bottom: 0.5em;
  }
</style>
