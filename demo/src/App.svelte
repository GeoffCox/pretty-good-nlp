<script lang="ts">
  import { Split } from "@geoffcox/svelte-splitter";
  import EditorView from "./EditorView.svelte";
  import EvalView from "./EvalView.svelte";
</script>

<!--
  @component
  The demo application
-->
<div class="root">
  <div class="app">
    <div class="header">@geoffcox/pretty-good-nlp demo</div>
    <div class="content">
      <Split initialPrimarySize="35%" resetOnDoubleClick>
        <svelte:fragment slot="primary">
          <EditorView />
        </svelte:fragment>
        <svelte:fragment slot="secondary">
          <EvalView />
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
