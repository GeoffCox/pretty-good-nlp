<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let tabs: string[];
  export let initialIndex = 0;

  let index: number = initialIndex;

  const dispatch = createEventDispatcher<{ changed: { index: number } }>();

  const raiseChanged = () => {
    dispatch("changed", {
      index: index,
    });
  };

  const onTabClick = (newIndex: number) => {
    index = newIndex;
    raiseChanged();
  };
</script>

<!--
  @component
  Provides a simple set of tabs for switching between content.
-->
<div class="tabs">
  {#each tabs as tab, i}
    <button
      class="tab"
      class:selected={index === i}
      on:click={() => onTabClick(i)}
    >
      {tab}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    padding: 5px 0 0 0;
    font-size: 12px;
    border-bottom: 1px solid #e1dfe1;
  }

  .tab {
    background-color: #e1dfe1;
    border-bottom: none;
    border-top: 1px solid #e1dfe1;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-left: 1px solid #e1dfe1;
    border-right: 1px solid #e1dfe1;
    color: #222;
    margin: 0 0 -1px 5px;
    min-width: 100px;    
    padding: 5px;
    user-select: none;
    display: flex;
    justify-content: center;
  }

  .tab.selected {
    background-color: #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    color: black;
  }
</style>
