// The profile's hero (1280 × 640, an 8 s loop): Moo's cow and wordmark on the left, and on the right a
// launcher panel that answers four real queries in turn — a calculation, a conversion, a time zone, an app.
// Everything is in place on the first frame (GitHub shows it before the loop starts); the motion is the
// queries typing and answering, a caret blinking, and light drifting behind, each a whole number of cycles
// in 8 s so the loop closes.

import { Kit, preset } from '@popcraft/kit/templates/kit'
import { defineTemplate } from '@popcraft/kit/templates/build'
import { glow, halo, blackShadow } from '@popcraft/kit/templates/shared/texture'
import { dotPaths } from '@popcraft/kit/templates/shared/marks'
import { media } from '@popcraft/kit'
import { mooBrand, ICON, W as SW } from '../shared/brand.ts'

const DUR = 8000
// Shorter than github-social: the buttons sit right under it in the README.
const H = 540
const QUERIES: [string, string, string][] = [
  ['12% of 3400', '408', 'Calculator'],
  ['5 mi in km', '8.05 km', 'Unit Converter'],
  ['3pm pst in tokyo', '8:00 AM tomorrow', 'Time Zones'],
  ['term', 'Terminal', 'Application'],
]
const STEP = DUR / QUERIES.length

export default defineTemplate({
  id: 'moomoi-hero',
  meta: {
    name: 'Moo profile hero',
    description: 'Moo, the keyboard launcher: the cow and wordmark, and a launcher answering four queries in turn. An 8 s loop for the moomoi GitHub profile.',
    category: 'animation', tags: ['animation', 'github', 'launcher', 'moo'],
    platforms: ['github'], formats: ['banner', 'gif'], useCases: ['brand-intro'],
    created: '2026-10-10', updated: '2026-10-10',
  },
  build() {
    const k = new Kit('Moo profile hero', { ...preset('github-social'), height: H })
    mooBrand(k)
    k.textStyle('Wordmark', { size: 150, fontWeight: 900, letterSpacing: -7, lineHeight: 150 })
    k.textStyle('Tagline', { size: 31, fontWeight: 700, letterSpacing: -0.6, lineHeight: 42 })
    k.textStyle('Lead', { size: 20, fontWeight: 400, lineHeight: 30 })
    k.textStyle('Chip', { size: 15, fontWeight: 600, lineHeight: 20, fontFamily: 'JetBrains Mono' })
    k.textStyle('Query', { size: 26, fontWeight: 500, lineHeight: 34, fontFamily: 'JetBrains Mono' })
    k.textStyle('Section', { size: 13, fontWeight: 700, lineHeight: 18, letterSpacing: 0.6 })
    k.textStyle('Row', { size: 20, fontWeight: 600, lineHeight: 26 })
    k.textStyle('Detail', { size: 15, fontWeight: 500, lineHeight: 20 })
    k.textStyle('Key', { size: 13, fontWeight: 700, lineHeight: 16, fontFamily: 'JetBrains Mono' })

    const sheet = k.sheet
    k.nameSheet(sheet, 'Hero')
    // The ground: the sheet lays nothing out itself (everything below is placed), on Moo's near-black.
    k.flowSheet(sheet, 0, 0, 'paper')
    k.patch(sheet, { clipsContent: true })
    k.timeline(sheet, { duration: DUR, fps: 30 })

    // The sky: two coloured lights that breathe, and a dot grid fading toward the bottom.
    const pink = glow(k, sheet, { x: 260, y: 120, w: 900, role: 'g1', alpha: 0.32, name: 'Pink light' })
    const blue = glow(k, sheet, { x: 1060, y: 480, w: 1000, role: 'g2', alpha: 0.3, name: 'Blue light' })
    k.behave(pink, 'opacity', [{ kind: 'sine', amp: 0.18, freq: 1 / (DUR / 1000) }])
    k.behave(blue, 'opacity', [{ kind: 'sine', amp: 0.18, freq: 1 / (DUR / 1000), phase: 0.5 }])
    k.vector(sheet, SW, H, dotPaths(SW, H, 28, 1.2), 'line', { name: 'Dots', opacity: 0.9, absolute: { x: 0, y: 0 } })

    // Left: the cow, the wordmark and what Moo is.
    const left = k.stack(sheet, { gap: 18, width: 540, name: 'Brand', absolute: { x: 72, y: 70 } })
    const tile = k.stack(left, { width: 104, height: 104, radius: 26, clip: true, effects: [halo(k, 'g3', 0.55, 40)], name: 'Icon' })
    k.picture(tile, media(ICON), 104, 104, { name: 'Moo icon', fit: 'FILL' })
    k.behave(tile, 'translateY', [{ kind: 'sine', amp: 5, freq: 2 / (DUR / 1000) }])
    const mark = k.text(left, 'Moo', { style: 'Wordmark', color: 'text', autoWidth: true, name: 'Wordmark' })
    // The wordmark in moo.moi's gradient.
    k.patch(mark, { fills: [k.gradient({ from: 'g1', to: 'g2', kind: 'LINEAR', angle: 0 })] })
    k.text(left, 'One hotkey. Then type anything.', { style: 'Tagline', color: 'text', width: 'FILL', name: 'Tagline' })
    k.text(left, 'A fast, native launcher: apps, files, answers, clipboard, windows, Ask AI and plugins in one search field.', { style: 'Lead', color: 'dim', width: 'FILL', name: 'Lead' })

    // Right: the launcher panel, answering.
    const PX = 648, PY = 70, PW = 560
    const panel = k.stack(sheet, { width: PW, height: 'HUG', radius: 26, fill: 'panel', stroke: { color: 'edge', width: 1.5 }, clip: true, effects: [blackShadow(0.6, 30, 80)], name: 'Launcher', absolute: { x: PX, y: PY } })
    const head = k.stack(panel, { direction: 'HORIZONTAL', gap: 16, align: 'CENTER', width: 'FILL', height: 76, padding: { top: 0, right: 24, bottom: 0, left: 24 }, name: 'Field' })
    k.picture(head, media(ICON), 30, 30, { name: 'Field icon', radius: 8, fit: 'FILL' })
    k.text(head, QUERIES[0][0], { style: 'Query', color: 'text', width: 'FILL', name: 'Query' })
    k.patch(k.rect(panel, 10, 1, 'line', { name: 'Divider' }), { layoutSizingHorizontal: 'FILL' })
    const list = k.stack(panel, { gap: 6, width: 'FILL', padding: { top: 14, right: 14, bottom: 14, left: 14 }, name: 'Results' })
    k.text(list, 'TOP HIT', { style: 'Section', color: 'dim', name: 'Section' })
    const hit = k.stack(list, { direction: 'HORIZONTAL', gap: 14, align: 'CENTER', width: 'FILL', height: 64, radius: 14, padding: { top: 0, right: 18, bottom: 0, left: 14 }, fill: 'hit', stroke: { color: 'hitEdge', width: 1 }, name: 'Top hit' })
    const badge = k.stack(hit, { direction: 'HORIZONTAL', width: 38, height: 38, radius: 10, align: 'CENTER', justify: 'CENTER', fill: 'g3', name: 'Badge' })
    k.text(badge, '=', { style: 'Row', color: 'text', autoWidth: true, name: 'Badge mark' })
    k.text(hit, QUERIES[0][1], { style: 'Row', color: 'text', width: 'FILL', name: 'Answer' })
    // A fixed box: the swapped words differ in length (Calculator, Unit Converter…).
    k.text(hit, QUERIES[0][2], { style: 'Detail', color: 'dim', width: 160, align: 'RIGHT', name: 'Kind' })
    for (const [name, detail, glyph] of [['Ask AI', 'Tab', 'AI'], ['Search the web', 'Google', 'G']]) {
      const row = k.stack(list, { direction: 'HORIZONTAL', gap: 14, align: 'CENTER', width: 'FILL', height: 56, padding: { top: 0, right: 18, bottom: 0, left: 14 }, name: 'Row' })
      const b = k.stack(row, { direction: 'HORIZONTAL', width: 38, height: 38, radius: 10, align: 'CENTER', justify: 'CENTER', fill: 'glass2', name: 'Row badge' })
      k.text(b, glyph, { style: 'Key', color: 'text', autoWidth: true })
      k.text(row, name, { style: 'Row', color: 'text', width: 'FILL', name: 'Row name' })
      k.text(row, detail, { style: 'Detail', color: 'dim', autoWidth: true, name: 'Row detail' })
    }
    // The footer, as Moo's: what Return does, and the keys.
    const foot = k.stack(panel, { direction: 'HORIZONTAL', gap: 10, align: 'CENTER', justify: 'MAX', width: 'FILL', height: 52, padding: { top: 0, right: 18, bottom: 0, left: 22 }, name: 'Footer' })
    for (const [label, key] of [['Open', 'return'], ['Actions', 'cmd K'], ['Ask AI', 'tab']]) {
      k.text(foot, label, { style: 'Detail', color: 'dim', autoWidth: true })
      const cap = k.stack(foot, { direction: 'HORIZONTAL', width: 'HUG', radius: 6, padding: { top: 4, right: 8, bottom: 4, left: 8 }, fill: 'glass2', name: 'Key' })
      k.text(cap, key, { style: 'Key', color: 'text', autoWidth: true })
    }

    // The queries: each one types in letter by letter, its answer lands, and it holds.
    const words = (i: number) => QUERIES.map(q => q[i])
    // Whole-word swaps with no stagger take exactly in + hold + out each, so they keep the two-second step.
    const IN = 260, OUT = 160, HOLD = STEP - IN - OUT
    k.swaps(sheet, [
      { layer: 'Query', words: words(0), at: 0, hold: HOLD, stagger: 0, in: IN, out: OUT, unit: 'word', rise: -10 },
      { layer: 'Answer', words: words(1), at: 120, hold: HOLD - 120, stagger: 0, in: IN, out: OUT, unit: 'word', rise: 14 },
      { layer: 'Kind', words: words(2), at: 120, hold: HOLD - 120, stagger: 0, in: IN, out: OUT, unit: 'word', rise: 8 },
    ])
    for (let i = 0; i < QUERIES.length; i++) {
      k.cues(sheet, [{ layer: 'Top hit', preset: 'pulse', at: i * STEP + 700, params: { duration: 420, amount: 0.025 } }])
    }
    return k.finish()
  },
})
