<script>
  import { createEventDispatcher } from 'svelte';
  import { rgbToHsv, hsvToRgb, rgbToHex, hsvToHex } from '$lib/colorUtils';
  const dispatch = createEventDispatcher();

  /** @type {number} */
  export let index; // expecting parent to set this
  export let mode = 'RGB'; // or HSV
  export let showControls = true;
  let showButton = false;

  let hex = '#000000';
  /** @type {[number, number, number]} */
  let values = [0, 0, 0];

  // indirection arrow functions (to control reactivity)
  const isHsv = () => mode === 'HSV';
  const toHsv = () => rgbToHsv(values);
  const toRgb = () => hsvToRgb(values);

  $: if (mode === 'HSV') {
    values = toHsv();
  } else {
    values = toRgb();
  }
  $: try { hex = isHsv() ? hsvToHex(values) : rgbToHex(values); } catch {};

  // @ts-ignore
  function hexInput(event) {
    /** @type {string} */
    let newHex = event.target.value;
    if (newHex.length === 6 && !newHex.startsWith('#')) {
      newHex = `#{newHex}`;
    } else if (newHex.length !== 7) {
      return;
    }
    console.log('hexInput', newHex);
    try {
      /** @type {[number, number, number]} */
      const rgb = [
        parseInt(newHex.substring(1, 3), 16), // #<12>3456
        parseInt(newHex.substring(3, 5), 16), // #12<34>56
        parseInt(newHex.substring(5), 16) // #1234<56>
      ];
      console.log('hexInput', rgb);
      if (mode === 'HSV') {
        values = rgbToHsv(rgb);
      } else {
        values = rgb;
      }
    } catch {
      // invalid hex color input - just ignore it
    }
  }

  // @ts-ignore
  function numberInput(event) {
    /** @type {string} */
    let newValue = event.target.value;
    if (newValue) {
      // I can't set id to a number, so it actually has the single quote characters in it
      const index = parseInt(event.target.id.replace("'", ''));
      values[index] = parseInt(newValue);
    }
  }
</script>

<!-- HTML -->

<div class="container">
  <!-- color display -->
  <div
    class="color-display"
    style="background-color: {hex}"
    on:mouseenter={() => {
      showButton = true;
    }}
    on:mouseleave={() => {
      showButton = false;
    }}
  >
    <!-- remove button -->
    <button
      class="remove-color"
      style:display={showButton ? '' : 'none'}
      on:click={() => dispatch('remove', { index })}>X</button
    >
  </div>

  <div class="controls" style:display={showControls ? '' : 'none'}>
    <!-- hex control -->
    <input
      class="hex-input"
      type="text"
      maxlength="7"
      placeholder="#000000"
      value={hex}
      on:input={hexInput}
    />

    <!-- slider + value controls -->
    {#each mode as component, index}
      <div class="slider-container">
        <label for={component}>{component}</label>
        <input
          class="slider"
          type="range"
          min="0"
          max={mode === 'HSV' ? (index === 0 ? 360 : 100) : 255}
          bind:value={values[index]}
        />
        <input
          id="'{index}'"
          class="slider-value"
          type="number"
          min="0"
          max={mode === 'HSV' ? (index === 0 ? 360 : 100) : 255}
          value={values[index]}
          on:input={numberInput}
        />
      </div>
    {/each}
  </div>
</div>

<!-- STYLE -->

<style>
  * {
    font-family: 'Courier New', Courier, monospace;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    min-width: 186px;
    position: relative;
  }
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }
  .hex-input {
    width: 57px;
  }
  .slider-container {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .slider {
    width: 100px;
  }
  .slider-value {
    width: 50px;
  }
  .color-display {
    width: 100%;
    height: 100px;
  }
  .remove-color {
    background-color: rgb(219, 39, 39);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    cursor: pointer;
    border: none;
    position: absolute;
    right: 7px;
    top: 7px;
    font-weight: bold;
  }
</style>
