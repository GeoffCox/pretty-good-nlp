<script lang="ts">
  import CodeMirror from "@svelte-parts/editor/codemirror";
  import type { EditorConfiguration, EditorFromTextArea } from "codemirror";
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/scheme/scheme.js";
  import YAML from "yaml";
  import type { Intent } from "@geoffcox/pretty-good-nlp";

  export let intent: Intent = {
    name: "Name your intent",
    examples: [],
  };

  const config: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: true,
    mode: "yaml",
  };

  let codeEditor: EditorFromTextArea = undefined;

  const updateYaml = (value: Intent) => {
    console.log("updateYaml");
    if (codeEditor) {
      codeEditor.setValue(YAML.stringify(value));
    }
  };

  const accessEditor = (editor) => {
    codeEditor = editor;
    editor.setSize("100%", "100%");
    updateYaml(intent);
    // editor.on("change", (e) => {
    //   try {
    //     const newIntent = YAML.parse(e.getValue());
    //     intent = newIntent;
    //   } catch (e) {}
    // });
  };

  $: {
    updateYaml(intent);
  }
</script>

<CodeMirror {config} {accessEditor} />
