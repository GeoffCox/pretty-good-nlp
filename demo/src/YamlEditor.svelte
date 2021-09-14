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

  let yaml = "";
  let sharedCodeMirror: EditorFromTextArea = undefined;

  type T = $$Generic;

  export const get = (): T => {
    return sharedCodeMirror?.getValue();
  };

  export const set = (value: T) => {
    yaml = YAML.stringify(value);
    sharedCodeMirror?.setValue(yaml);
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

  const accessSharedCodeMirror = (editor) => {
    sharedCodeMirror = editor;
    editor.setSize("100%", "100%");

    editor.on("change", (editor: Editor) => {
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
</div>

<style>
  .yaml-editor {
    width: 100%;
    height: 100%;    
  }
</style>