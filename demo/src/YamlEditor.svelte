<script lang="ts">
  import CodeMirror from "@svelte-parts/editor/codemirror";
  import type {
    Editor,  
    EditorConfiguration,
    EditorFromTextArea,
  } from "codemirror";
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/scheme/scheme.js";
  import { createEventDispatcher } from "svelte";

  export let yaml: string = "";

  const dispatch = createEventDispatcher<{ changed: { yaml: string } }>();

  const raiseChanged = () => {
    dispatch("changed", {
      yaml,
    });
  };

  const config: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: true,
    mode: "yaml",
  };

  let codeEditor: EditorFromTextArea = undefined;

  const accessEditor = (editor) => {
    codeEditor = editor;
    editor.setSize("100%", "100%");

    editor.on("change", (editor: Editor /*, change: EditorChange*/) => {
      // TODO: Wrap CodeMirror in Svelte control for everyone?
      // console.log(
      //   `${change.from}..${change.to} ${change.text} ${change.removed}`
      // );
      yaml = editor.getValue();
      raiseChanged();
    });

    editor.setValue(yaml);
  };

  $: {
    codeEditor && codeEditor.setValue(yaml);
  }
</script>

<CodeMirror {config} {accessEditor} />
