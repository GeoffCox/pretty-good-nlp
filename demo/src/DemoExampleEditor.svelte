<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { IntentsDocument } from "./types";
  import { Split } from "@geoffcox/svelte-splitter";
  import YamlEditor from "./YamlEditor.svelte";

  let document: IntentsDocument;

  let intentsYamlEditor;
  let sharedYamlEditor;

  export const get = (): IntentsDocument => {
    if (document) {
      return {
        ...document,
        intents: intentsYamlEditor?.get() || [],
        shared: sharedYamlEditor?.get(),
      };
    }
  };

  export const set = (intentsDocument: IntentsDocument) => {
    document = intentsDocument;

    intentsYamlEditor?.set(document?.intents || []);
    sharedYamlEditor?.set(document?.shared);
  };

  export const format = () => {
    intentsYamlEditor?.format();
    sharedYamlEditor?.format();
  };

  const dispatch = createEventDispatcher<{ changed: {} }>();

  const raiseChanged = () => {
    dispatch("changed", {});
  };
</script>

<!--
  @component
  Provides an editor for a set of intents and their shared parts
-->
<div class="editor">
  <Split horizontal resetOnDoubleClick initialPrimarySize='50%'>
    <svelte:fragment slot="primary">
      <div class="intents">
        <YamlEditor
          bind:this={intentsYamlEditor}
          on:changed={() => raiseChanged()}
        />
      </div>
    </svelte:fragment>
    <svelte:fragment slot="secondary">
      <div class="shared">
        <YamlEditor
          bind:this={sharedYamlEditor}
          on:changed={() => raiseChanged()}
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