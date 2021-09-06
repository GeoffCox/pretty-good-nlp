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

<div class="tabs">
  {#each tabs as tab, i}
    <div
      class="tab"
      class:selected={index === i}
      on:click={() => onTabClick(i)}
      role="button"
    >
      {tab}
    </div>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    padding: 5px 0 0 0;
    font-size: 12px;
    border-bottom: 1px solid lightgray;
  }
  .tab {
    background-color: lightgray;
    border-bottom: none;
    border-top: 1px solid gray;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-left: 1px solid gray;
    border-right: 1px solid gray;
    color: #222;
    margin: 0 0 -1px 5px;
    min-width: 100px;
    outline: none;
    padding: 5px;
    user-select: none;
    display: flex;
    justify-content: center;
  }

  .tab.selected {
    background-color: white;
    border-bottom: 1px solid white;
    color: black;
  }
</style>
