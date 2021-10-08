<script lang="ts">
  import { Split } from "@geoffcox/svelte-splitter";
  import MainEditor from "./MainEditor.svelte";
  import OutputView from "./ResultsView.svelte";
</script>

<div class="root">
  <div class="app">
    <div class="header">@geoffcox/pretty-good-nlp demo</div>
    <div class="content">
      <Split initialPrimarySize="550px" resetOnDoubleClick>
        <svelte:fragment slot="primary">
          <MainEditor />
        </svelte:fragment>
        <svelte:fragment slot="secondary">
          <OutputView />
        </svelte:fragment>
      </Split>
    </div>
    <div class="footer" />
  </div>
</div>

<style>
  /* Absolute positioning provides an SPA layout */
  .root {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  .app {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas: "header" "content" "footer";
  }

  .header {
    box-sizing: border-box;
    font-size: 14pt;
    width: 100%;
    height: 100%;
    outline: none;
    overflow: hidden;
    grid-area: header;
    padding: 10px;
    background: #222;
    color: #ddd;
  }

  .content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    outline: none;
    overflow: hidden;
    grid-area: content;    
  }

  .footer {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    outline: none;
    overflow: hidden;
    grid-area: footer;
    background: #222;
    color: #ddd;
  }
</style>
