// Guards the palette contract: every text and boundary role must reach its
// WCAG threshold against the backgrounds it is actually used on.
//
// Reads the tokens straight out of app/globals.css, so the palette is never
// duplicated here and a token edit cannot silently skip the check. The app
// ships a single light theme, so each pair is asserted once.
//
// The wordmark gradient is intentionally not checked: WCAG exempts logotypes.
//
// Run with: pnpm check:contrast
import { readFileSync } from 'node:fs';

const CSS_PATH = new URL('../app/globals.css', import.meta.url);
const css = readFileSync(CSS_PATH, 'utf8');

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

const tokens = {};
for (const match of css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  tokens[match[1]] = match[2].toUpperCase();
}

if (Object.keys(tokens).length === 0) {
  throw new Error(
    'No color tokens found in globals.css — the contrast guard would silently pass.',
  );
}

function channelLuminance(value) {
  const ratio = value / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) =>
    channelLuminance(Number.parseInt(hex.slice(i, i + 2), 16)),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  const [high, low] = a > b ? [a, b] : [b, a];
  return (high + 0.05) / (low + 0.05);
}

// foreground role, background role, minimum ratio
const REQUIRED = [
  // Body and supporting text, on the page and on raised surfaces.
  ['foreground', 'background', AA_TEXT],
  ['foreground', 'surface', AA_TEXT],
  ['heading', 'background', AA_TEXT],
  ['heading', 'surface', AA_TEXT],
  ['muted', 'background', AA_TEXT],
  ['muted', 'surface', AA_TEXT],
  // Link and primary-text roles: must work on both surfaces.
  ['primary-text', 'background', AA_TEXT],
  ['primary-text', 'surface', AA_TEXT],
  ['primary-text', 'primary-surface', AA_TEXT],
  // Primary button fill with its own label.
  ['primary-foreground', 'primary', AA_TEXT],
  // Semantic feedback text, on the page and on its own tinted chip.
  ['danger', 'background', AA_TEXT],
  ['danger', 'surface', AA_TEXT],
  ['success', 'background', AA_TEXT],
  ['success', 'success-surface', AA_TEXT],
  ['warning', 'background', AA_TEXT],
  ['warning', 'warning-surface', AA_TEXT],
  ['progress', 'background', AA_TEXT],
  ['progress', 'progress-surface', AA_TEXT],
  // Boundaries and focus indicators only need the non-text threshold.
  ['border-strong', 'background', AA_NON_TEXT],
  ['border-strong', 'surface', AA_NON_TEXT],
  ['focus', 'background', AA_NON_TEXT],
  ['focus', 'surface', AA_NON_TEXT],
];

// The palette's headline color is unusable as text on light backgrounds.
// This is asserted explicitly so nobody "fixes" the accent into a text role.
const FORBIDDEN_AS_TEXT = [['accent', 'background']];

const failures = [];

for (const [fg, bg, min] of REQUIRED) {
  if (!(fg in tokens) || !(bg in tokens)) {
    failures.push(`missing token: ${fg in tokens ? bg : fg}`);
    continue;
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  if (ratio < min) {
    failures.push(
      `${fg} (${tokens[fg]}) on ${bg} (${tokens[bg]}) = ${ratio.toFixed(2)}, needs ${min}`,
    );
  }
}

for (const [fg, bg] of FORBIDDEN_AS_TEXT) {
  const ratio = contrast(tokens[fg], tokens[bg]);
  if (ratio >= AA_TEXT) {
    failures.push(
      `${fg} must stay decorative: it unexpectedly passes text contrast (${ratio.toFixed(2)}). Review why before removing this guard.`,
    );
  }
}

if (failures.length > 0) {
  console.error(`Contrast check FAILED (${failures.length} problem(s)):`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

const total = REQUIRED.length + FORBIDDEN_AS_TEXT.length;

console.log(`Contrast check passed: ${total} assertions (light theme).`);
console.log(
  `  accent ${tokens.accent} on ${tokens.background} = ${contrast(tokens.accent, tokens.background).toFixed(2)} (decorative only, as intended)`,
);
