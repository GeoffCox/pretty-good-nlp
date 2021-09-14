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
  
    export const get = (): Record<string, string[]> => {
      return sharedCodeMirror?.getValue();
    };
  
    export const set = (value: Record<string, string[]>) => {
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
  
  <CodeMirror
    config={sharedCodeMirrorConfig}
    accessEditor={accessSharedCodeMirror}
  />
  