<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let text: string;

  const dispatch = createEventDispatcher();

  const onRecognize = () => {
    dispatch("recognize", {
      text,
    });
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onRecognize();
    }
  }
</script>

<div class="utterance-input">
  <input
    type="text"
    bind:value={text}
    placeholder="Type something to recognize"
    on:keypress={onKeyPress}
  />
  <button on:click={() => onRecognize()}>Recognize</button>
</div>

<style>
    .utterance-input {
        margin: 20px auto;
        width: 80%;
    }
    .utterance-input input {
        width: 450px;
    }
</style>
