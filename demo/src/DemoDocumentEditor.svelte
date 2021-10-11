<script lang="ts">
  import type { DemoDocument } from "./types";

  import { createEventDispatcher } from "svelte";  
  import { Split } from "@geoffcox/svelte-splitter";
  import YamlEditor from "./YamlEditor.svelte";

  let document: DemoDocument;

  let intentsYamlEditor;
  let sharedYamlEditor;

  export const get = (): DemoDocument => {
    if (document) {
      return {
        ...document,
        intents: intentsYamlEditor?.get() || [],
        shared: sharedYamlEditor?.get(),
      };
    }
  };

  export const set = (intentsDocument: DemoDocument) => {
    document = intentsDocument;
    intentsYamlEditor?.set(document?.intents || []);
    sharedYamlEditor?.set(document?.shared);
  };

  export const format = () => {
    intentsYamlEditor?.format();
    sharedYamlEditor?.format();
  };

  type ChangeOrigin = "input" | "set";

  const dispatch =
    createEventDispatcher<{ changed: { origin: ChangeOrigin } }>();

    const raiseChanged = (origin: ChangeOrigin) => {    
    dispatch("changed", { origin });
  };

  const onChanged = (event) => {  
    raiseChanged(event.detail.origin);
  }
</script>

<!--
  @component
  Editor for a demo document (a set of intents and their shared expressions)
-->
<div class="editor">
  <Split horizontal resetOnDoubleClick initialPrimarySize='50%'>
    <svelte:fragment slot="primary">
      <div class="intents">
        <YamlEditor
          bind:this={intentsYamlEditor}
          on:changed={(event) => onChanged(event)}
        />
      </div>
    </svelte:fragment>
    <svelte:fragment slot="secondary">
      <div class="shared">
        <YamlEditor
          bind:this={sharedYamlEditor}
          on:changed={(event) => onChanged(event)}
        />
      </div>
    </svelte:fragment>
  </Split>
</div>

<style>
  .editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .intents, .shared {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>