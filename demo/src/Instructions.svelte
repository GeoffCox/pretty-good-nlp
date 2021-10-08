<div class="instructions">
  <div class="content">
    <h1>Welcome!</h1>
    <p>This demo shows how the pretty-good-nlp recognizer works.</p>
    <h2>Intents and Editing</h2>
    <p>
      On the left you can choose from one of the intent documents. Whichever tab
      you select becomes the active document for recognition.
    </p>
    <ul>
      <li>
        <b>Coffee Order</b> demonstrates a single basic intent.
      </li>
      <li>
        <b>Vacation</b> demonstrates using shared phrases and regular expressions.
      </li>
      <li>
        <b>Playground</b> provides a starting point for writing your own intents.
      </li>
    </ul>
    <p>
      The top pane contains the list of intents. Each intent is made up of a
      list of examples. Each example is a list of parts. A can have phrases,
      patterns, and/or regular expressions.
    </p>
    <p>
      The bottom pane contains the shared phrases, patterns, and regular
      expressions for the current document. Shared items can be used by multiple
      intents in the document using the $ref= expression.
    </p>
  </div>
</div>

<style>
  .instructions {    
  }

  .content {
    padding: 20px;
    max-width: 500px;
    margin: auto;
  }


  .instructions ul li {
    margin-bottom: 0.5em;
  }
</style>
