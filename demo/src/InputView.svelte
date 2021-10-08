<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let text: string = "";

  let autoRecognize = true;
  let currentText = "";

  // When text changes, update current text
  $: {
    currentText = text;
  }

  const dispatch = createEventDispatcher();

  const raiseChange = () => {
    dispatch("change", {});
  };

  const updateText = () => {
    text = currentText;
    raiseChange();
  };

  // When autoRecognize is turned on, update
  $: {
    if (autoRecognize) {
      updateText();
    }
  }

  // When the current text or autoRecognize changes, update
  $: {
    if (autoRecognize && text !== currentText) {
      updateText();
    }
  }

  // When the user presses enter, update
  const onInputKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      updateText();
    }
  };

  const onUpdateClick = () => {
    if (text !== currentText) {
      updateText();
    }
  }
</script>

<!--
  @component
  Provides the text input to recognize
-->
<div class="input-view">
  <div class="input-field">
    <label>
      Type something to recognize
      <input
        id="TextInput"
        type="text"
        bind:value={currentText}
        on:keypress={onInputKeyPress}
      />
    </label>
    <button class="update-button" on:click={onUpdateClick}>Go</button>
  </div>
  <div class="options">
    <label>
      <input type="checkbox" bind:checked={autoRecognize} />
      Auto recognize
    </label>
  </div>
</div>

<style>
  .input-view {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    padding: 10px;
    width: 100%;
    height: 100%;
    min-width: 0;
  }
  .input-field {
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-rows: auto;
    align-items: stretch;
    width: 100%;
    height: 100%;
  }
  .input-field label {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    align-items: center;
    column-gap: 5px;
    width: 100%;
    height: 100%;
  }
  
  .update-button {
    padding: 4px;
    min-width: 50px;    
  }
  .options {
    justify-self: end;
    align-self: center;
    width: 100%;
    height: 100%;
  }

  .options label {
    user-select: none;
    padding: 4px;
    margin: 0 4px;
  }
</style>
