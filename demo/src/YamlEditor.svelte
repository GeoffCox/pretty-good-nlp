<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import YAML from "yaml";
  import CodeMirror from "@svelte-parts/editor/codemirror";
  import type {
    Editor,
    EditorConfiguration,
    EditorFromTextArea,
  } from "codemirror";
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/scheme/scheme.js";

  type T = $$Generic;

  let yaml = "";
  let errorMessage = undefined;

  let sharedCodeMirror: EditorFromTextArea = undefined;

  export const get = (): T => {
    return YAML.parse(sharedCodeMirror?.getValue());
  };

  export const set = (value: T) => {
      yaml = value ? YAML.stringify(value) : "";
      sharedCodeMirror?.setValue(yaml);
  };

  export const format = () => {
    set(get());
  };

  const dispatch = createEventDispatcher<{ changed: {} }>();

  const raiseChanged = () => {
    dispatch("changed", {});
  };

  const sharedCodeMirrorConfig: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: true,
    mode: "yaml",
  };

  const verify = () => {
    try {
      YAML.parse(sharedCodeMirror?.getValue());
      errorMessage = "";
    } catch (error) {
      errorMessage = error.message;
    }
  };

  const accessSharedCodeMirror = (editor) => {
    sharedCodeMirror = editor;
    editor.setSize("100%", "100%");

    editor.on("change", (editor: Editor) => {
      verify();
      raiseChanged();
    });

    sharedCodeMirror?.setValue(yaml);
  };
</script>

<!--
  @component
  Provides basic YAML editing via CodeMirror
-->
<div class="yaml-editor">
  <CodeMirror
    config={sharedCodeMirrorConfig}
    accessEditor={accessSharedCodeMirror}
  />
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}
</div>

<style>
  .yaml-editor {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
  }

  .error {
    background-color: pink;
    color: red;
    padding: 4px;
  }
</style>
