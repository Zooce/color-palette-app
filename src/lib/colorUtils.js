/**
 * Limit `x
 * @param {number} x
 * @returns {number}
 */
const L = (x) => Math.round(x * 1000) / 1000;

/**
 * Convert RGB to HSV
 * @param {[number, number, number]} rgb - An array of RGB values [R, G, B] (0-255)
 * @returns {[number, number, number]} An array of HSV values [H, S, V] where H is in range [0, 360), S and V are in range [0, 100]
 */
export function rgbToHsv(rgb) {
  const r = L(rgb[0] / 255),
        g = L(rgb[1] / 255),
        b = L(rgb[2] / 255);
  // const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const diff = max - min;
  const h = diff === 0 ? 0 :
    max === r ? (60 * ((g - b) / diff) + 360) % 360 :
    max === g ? (60 * ((b - r) / diff) + 120) :
    (60 * ((r - g) / diff) + 240);
  const s = max === 0 ? 0 : diff / max;
  const v = max;
  return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
}

/**
 * Convert HSV to RGB
 * @param {[number, number, number]} hsv - An array of HSV values [H, S, V] where H is in range [0, 360), S and V are in range [0, 100]
 * @returns {[number, number, number]} An array of RGB values [R, G, B] (0-255)
 */
export function hsvToRgb(hsv) {
  const h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100;
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs(hh % 2 - 1));
  const m = v - c;
  let r, g, b;

  // Use switch to determine RGB values based on the value of hh
  switch (Math.floor(hh)) {
    case 0: r = c; g = x; b = 0; break;
    case 1: r = x; g = c; b = 0; break;
    case 2: r = 0; g = c; b = x; break;
    case 3: r = 0; g = x; b = c; break;
    case 4: r = x; g = 0; b = c; break;
    case 5: r = c; g = 0; b = x; break;
    default: r = 0; g = 0; b = 0;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/**
 * Convert RGB to Hex
 * @param {[number, number, number]} rgb - An array of RGB values [R, G, B] (0-255)
 * @returns {string} A hex color string in the format "#RRGGBB"
 */
export function rgbToHex(rgb) {
  try {
    return '#' + rgb.map(val => val.toString(16).padStart(2, '0')).join('');
  } catch {
    throw new Error(`invalid input: ${rgb}`);
  }
}

/**
 * Convert HSV to Hex
 * @param {[number, number, number]} hsv - An array of HSV values [H, S, V] where H is in range [0, 360), S and V are in range [0, 100]
 * @returns {string} A hex color string in the format "#RRGGBB"
 */
export function hsvToHex(hsv) {
  try {
    const rgb = hsvToRgb(hsv);
    return rgbToHex(rgb);
  } catch {
    throw new Error(`invalid input: ${hsv}`);
  }
}
