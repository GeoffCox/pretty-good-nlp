<script lang="ts">
  import { intentsDocuments } from "./stores";
  import YAML from "yaml";
  import Tabs from "./Tabs.svelte";
  import YamlEditor from "./YamlEditor.svelte";

  $: documentNames = $intentsDocuments.map((x) => x.name);

  let tabIndex = 0;
  const onTabChanged = (index: number) => {
      console.log(index);
    tabIndex = index;
  };

  $: currentDocument = $intentsDocuments[tabIndex];

  $: yaml = YAML.stringify(currentDocument.intents[0]);

</script>

<div class="intents-editor">
  <Tabs
    tabs={documentNames}
    initialIndex={tabIndex}
    on:changed={(event) => onTabChanged(event.detail.index)}
  />
  <YamlEditor {yaml} />
</div>

<style>
  .intents-editor {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }
</style>
