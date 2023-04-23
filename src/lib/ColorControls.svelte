<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let showControls = true;
	/** @type {number} */
  export let index;
	export let mode = 'RGB'; // or HSB

  let showButton = false;

	/** @type {[number, number, number]} */
	let values = [0, 0, 0];
	let hex = '#000000';

	// we don't want this reactive value to change based on `values` hence the indirection functions
	$: if (mode === 'HSB') {
		values = toHsb();
		console.log('values changed');
	} else {
		values = toRgb();
		console.log('values changed');
	}

	function toHsb() {
		return rgbToHsb(values);
	}
	function toRgb() {
		return hsbToRgb(values);
	}

	/**
	 * Convert RGB to HSB.
	 * (credit: https://github.com/Qix-/color-convert/blob/master/conversions.js)
	 * @param {[number, number, number]} rgb
	 * @return {[number, number, number]}
	 */
	export function rgbToHsb(rgb) {
		let rdif;
		let gdif;
		let bdif;
		let h = 0;
		let s = 0;

		const r = rgb[0] / 255;
		const g = rgb[1] / 255;
		const b = rgb[2] / 255;
		const v = Math.max(r, g, b);
		const diff = v - Math.min(r, g, b);
		const diffc = function (/** @type number */ c) {
			return (v - c) / 6 / diff + 1 / 2;
		};

		if (diff !== 0) {
			s = diff / v;
			rdif = diffc(r);
			gdif = diffc(g);
			bdif = diffc(b);

			if (r === v) {
				h = bdif - gdif;
			} else if (g === v) {
				h = 1 / 3 + rdif - bdif;
			} else if (b === v) {
				h = 2 / 3 + gdif - rdif;
			}

			if (h < 0) {
				h += 1;
			} else if (h > 1) {
				h -= 1;
			}
		}

		return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
	}

	/**
	 * Convert HSB to RGB.
	 * (credit: https://github.com/Qix-/color-convert/blob/master/conversions.js)
	 * @param {[number, number, number]} hsb
	 * @return {[number, number, number]}
	 */
	function hsbToRgb(hsb) {
		const h = hsb[0] / 60;
		const s = hsb[1] / 100;
		let v = hsb[2] / 100;
		const hi = Math.floor(h) % 6;

		const f = h - Math.floor(h);
		let p = 255 * v * (1 - s);
		let q = 255 * v * (1 - s * f);
		let t = 255 * v * (1 - s * (1 - f));
		v *= 255;

		v = Math.round(v);
		p = Math.round(p);
		q = Math.round(q);
		t = Math.round(t);

		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
			default:
				return [0, 0, 0];
		}
	}

	$: try {
		hex = `#${(mode === 'HSB' ? hsbToRgb(values) : values)
			.map((x) => x.toString(16).padStart(2, '0'))
			.join('')}`;
		console.log('hex changed');
	} catch {
		console.error('invalid values');
	}

	function hexInput(/** @type {Event} */ event) {
    // @ts-ignore
		let newHex = event.target?.value;
		if (newHex.length !== 7) {
			return;
		}
		try {
      /** @type {[number, number, number]} */
			let rgb = [
				parseInt(newHex.substring(1, 3), 16), // #<12>3456
				parseInt(newHex.substring(3, 5), 16), // #12<34>56
				parseInt(newHex.substring(5), 16) // #1234<56>
			];
			if (mode === 'HSB') {
				values = rgbToHsb(rgb);
			} else {
				values = rgb;
			}
		} catch {
			console.error('invalid hex value', newHex);
		}
	}
</script>

<!-- HTML -->

<div class="container">

	<!-- color display -->
	<div
    class="color-display"
    style="background-color: {hex}"
    on:mouseenter={() => { showButton = true; }}
    on:mouseleave={() => { showButton = false; }}
  >
    <!-- remove button -->
    <button
      class=remove-color
      style:display={showButton ? '' : 'none'}
      on:click={() => dispatch('remove', { index })}
    >X</button>
  </div>

  <div class=controls style:display={showControls ? '' : 'none'}>
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
          max={mode === 'HSB' ? (index === 0 ? 360 : 100) : 255}
          bind:value={values[index]}
        />
        <input
          class="slider-value"
          type="number"
          min="0"
          max={mode === 'HSB' ? (index === 0 ? 360 : 100) : 255}
          bind:value={values[index]}
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
