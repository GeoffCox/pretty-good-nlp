<script lang="ts">
  import { onMount } from "svelte";
  import debounce from "lodash-es/debounce";  
  import {
    demoDocuments,
    demoDocumentIndex,
    initialDemoDocuments,
  } from "./stores";
  import DemoDocumentEditor from "./DemoDocumentEditor.svelte";
  import Tabs from "./Tabs.svelte";  

  let demoExampleEditor;

  $: tabNames = $demoDocuments.map((x) => x.name);

  let updating = false;
  const updateDemoExample = debounce(() => {
    if (demoExampleEditor) {
      $demoDocuments[$demoDocumentIndex] = demoExampleEditor.get();
      console.log("set $document");
    }
    updating = false;
  }, 500);

  onMount(() => {
    demoExampleEditor?.set($demoDocuments[$demoDocumentIndex]);
  });

  const onChanged = (event) => {
    if (event.detail.origin === "input") {
      updating = true;
      updateDemoExample();
    }
  };

  const onTabChanged = (index: number) => {
    // Wait for updates before switching tabs.
    if (updating) {
      const waitForUpdate = setInterval(() => {
        console.log("waitForUpdate");
        if (!updating) {
          console.log(`setting tab to ${index}`);
          $demoDocumentIndex = index;
          demoExampleEditor?.set($demoDocuments[$demoDocumentIndex]);
          clearInterval(waitForUpdate);
        }
      }, 500);
    } else {
      console.log(`setting tab to ${index}`);
      $demoDocumentIndex = index;
      demoExampleEditor?.set($demoDocuments[$demoDocumentIndex]);
    }
  };

  const onFormat = () => {
    demoExampleEditor?.format();
  };

  const onReset = () => {    
    if ($demoDocumentIndex < initialDemoDocuments.length) {      
      demoExampleEditor?.set(initialDemoDocuments[$demoDocumentIndex]);
    }   
  };
</script>

<!--
  @component
  MDI editor for the demo documents
-->
<div class="editor">
  <Tabs
    tabs={tabNames}
    initialIndex={$demoDocumentIndex}
    on:changed={(event) => onTabChanged(event.detail.index)}
  />
  <div class="toolbar">
    <button on:click={onFormat}>Format</button>
    <button on:click={onReset}>Reset</button>
  </div>
  <DemoDocumentEditor bind:this={demoExampleEditor} on:changed={onChanged} />
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
    background: #f5f5f5;    
    display: flex;
    flex-direction: row;    
    justify-content: flex-end;
    width: 100%;
  }

  .toolbar button {
    margin: 4px;
    font-size: 14px;
    background: #fefefe;
  }
</style>
