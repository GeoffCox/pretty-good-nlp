<script lang="ts">
  import IntentsDocumentEditor from "./DemoExampleEditor.svelte";
  import { intentsDocuments } from "./stores";
  import Tabs from "./Tabs.svelte";

  let intentsDocumentEditor;

  $: documentNames = $intentsDocuments.map((x) => x.name);

  let tabIndex = 0;
  const onTabChanged = (index: number) => {
    console.log(index);
    tabIndex = index;
  };

  $: {
    intentsDocumentEditor?.set($intentsDocuments[tabIndex]);
  }
</script>

<div class="editor">
  <Tabs
    tabs={documentNames}
    initialIndex={tabIndex}
    on:changed={(event) => onTabChanged(event.detail.index)}
  />
  <div class="toolbar">
    <button>Format</button>
    <button>Reset</button>
  </div>
  <IntentsDocumentEditor bind:this={intentsDocumentEditor} />
</div>

<style>
  .editor {
    display: grid;
    grid-template-rows: auto auto 1fr;
    grid-template-columns: 1fr;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .toolbar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    background: lightgray;
  }

  .toolbar button {
    margin: 4px;
  }
</style>
