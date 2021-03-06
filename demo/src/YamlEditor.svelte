<script lang="ts">
  import type {
    Editor,
    EditorConfiguration,
    EditorFromTextArea,
  } from "codemirror";

  import { createEventDispatcher } from "svelte";
  import YAML from "yaml";
  import CodeMirror from "@svelte-parts/editor/codemirror";
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/scheme/scheme.js";

  type T = $$Generic;

  let yaml = "";
  let isSetting = false;
  let errorMessage = undefined;

  let cmEditor: EditorFromTextArea = undefined;

  export const get = (): T => {
    return YAML.parse(cmEditor?.getValue());
  };

  export const set = (value: T) => {
    yaml = value ? YAML.stringify(value) : "";
    isSetting = true;
    cmEditor?.setValue(yaml);
    isSetting = false;
  };

  export const format = () => {
    set(get());
  };

  type ChangeOrigin = "input" | "set";

  const dispatch =
    createEventDispatcher<{ changed: { origin: ChangeOrigin } }>();

  const raiseChanged = (origin: ChangeOrigin) => {
    dispatch("changed", { origin });
  };

  const config: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: true,
    mode: "yaml",
  };

  const verify = () => {
    try {
      YAML.parse(cmEditor?.getValue());
      errorMessage = "";
    } catch (error) {
      errorMessage = error.message;
    }
  };

  const accessEditor = (editor) => {
    cmEditor = editor;
    editor.setSize("100%", "100%");

    editor.on("change", (editor: Editor, change) => {
      verify();
      console.log(`YAML editor change.origin:${change?.origin}`);
      raiseChanged(
        change?.origin && change.origin.includes("setValue") ? "set" : "input"
      );
    });

    editor?.setValue(yaml);
  };
</script>

<!--
  @component
  Provides basic YAML editing via CodeMirror
-->
<div class="yaml-editor">
  <CodeMirror config={config} {accessEditor} />
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
