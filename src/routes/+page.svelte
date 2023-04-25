<!-- src/routes/index.svelte -->
<script>
  import ColorControls from '$lib/ColorControls.svelte';
  let colorMode = 'RGB';

  /** @type {number[]} */
  let colorIds = [1, 2, 3];
  let nextId = 4;

  function addColor() {
    colorIds = [...colorIds, nextId];
    nextId += 1;
  }

  function removeColor(/** @type {Event} */ event) {
    // @ts-ignore
    colorIds.splice(event.detail.index, 1);
    colorIds = colorIds;
  }

  let showControls = true;
  let toggleText = 'Hide Controls';

  function toggleControls() {
    if (showControls) {
      toggleText = 'Show Controls';
    } else {
      toggleText = 'Hide Controls';
    }
    showControls = !showControls;
  }
</script>

<div class="common-controls">
  <select bind:value={colorMode}>
    <option value="RGB">RGB</option>
    <option value="HSV">HSV</option>
  </select>

  <button on:click={addColor}>Add Color</button>

  <button on:click={toggleControls}>{toggleText}</button>
</div>

<div class="color-palette">
  {#each colorIds as colorId, index (colorId)}
    <ColorControls bind:mode={colorMode} {index} on:remove={removeColor} {showControls} />
  {/each}
</div>

<style>
  * {
    font-family: 'Courier New', Courier, monospace;
  }
  .color-palette {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .common-controls {
    display: flex;
    justify-content: left;
    gap: 1rem;
    margin-bottom: 10px;
  }
</style>
