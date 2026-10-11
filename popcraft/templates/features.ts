// What Moo does (1280 × 560, a 6 s loop): six tiles, each a feature with a real query, and Moo's selection
// highlight stepping through them once a second as if someone were pressing ↓ — the loop ends on the tile it
// started on.

import { Kit, preset } from '@popcraft/kit/templates/kit'
import { defineTemplate } from '@popcraft/kit/templates/build'
import { glow, blackShadow, halo } from '@popcraft/kit/templates/shared/texture'
import { dotPaths } from '@popcraft/kit/templates/shared/marks'
import { ease } from '@popcraft/kit'
import { mooBrand, W } from '../shared/brand.ts'

const H = 560
const DUR = 6000
const FEATURES: [string, string, string, string][] = [
  ['Apps and files', 'Fuzzy search over every app, and files from a live index.', 'term', 'Terminal'],
  ['Instant answers', 'Math, units, currencies and time zones as you type.', '5 mi in km', '8.05 km'],
  ['Clipboard history', 'Everything you copied, searchable. Never written to disk.', 'clip', '24 items'],
  ['Window layouts', 'Halves, thirds, quarters and other displays.', 'left half', 'Arranged'],
  ['Ask AI', 'Tab on any question: on-device, or your own provider.', 'battery?', '87%, charging'],
  ['moo, the command', 'The app is the CLI too. Script it from anywhere.', '$ moo calc 6*7', '42'],
]
const COLS = 3, TW = 368, TH = 172, GAP = 24
const GX = (W - COLS * TW - (COLS - 1) * GAP) / 2, GY = 160
const at = (i: number) => ({ x: GX + (i % COLS) * (TW + GAP), y: GY + Math.floor(i / COLS) * (TH + GAP) })

export default defineTemplate({
  id: 'moomoi-features',
  meta: {
    name: 'Moo features',
    description: 'What Moo does: six features with a real query each, and the selection stepping through them. A 6 s loop for the moomoi GitHub profile.',
    category: 'animation', tags: ['animation', 'github', 'launcher', 'moo'],
    platforms: ['github'], formats: ['banner', 'gif'], useCases: ['education'],
    created: '2026-10-10', updated: '2026-10-10',
  },
  build() {
    const k = new Kit('Moo features', { ...preset('github-social'), height: H })
    mooBrand(k)
    k.textStyle('Kicker', { size: 15, fontWeight: 700, letterSpacing: 2, lineHeight: 20, fontFamily: 'JetBrains Mono' })
    k.textStyle('Title', { size: 44, fontWeight: 800, letterSpacing: -1.4, lineHeight: 52 })
    k.textStyle('Tile title', { size: 23, fontWeight: 700, letterSpacing: -0.3, lineHeight: 30 })
    k.textStyle('Tile body', { size: 16, fontWeight: 400, lineHeight: 23 })
    k.textStyle('Query', { size: 15, fontWeight: 500, lineHeight: 20, fontFamily: 'JetBrains Mono' })

    const sheet = k.sheet
    k.flowSheet(sheet, 0, 0, 'paper')
    k.patch(sheet, { clipsContent: true })
    k.timeline(sheet, { duration: DUR, fps: 30 })
    const purple = glow(k, sheet, { x: W / 2, y: 40, w: 1100, role: 'g3', alpha: 0.22, name: 'Light' })
    k.behave(purple, 'opacity', [{ kind: 'sine', amp: 0.12, freq: 1 / (DUR / 1000) }])
    k.vector(sheet, W, H, dotPaths(W, H, 28, 1.2), 'line', { name: 'Dots', absolute: { x: 0, y: 0 } })

    const head = k.stack(sheet, { gap: 8, width: W - 2 * GX, name: 'Heading', absolute: { x: GX, y: 48 } })
    k.text(head, 'WHAT IT DOES', { style: 'Kicker', color: 'g1', autoWidth: true, name: 'Kicker' })
    k.text(head, 'Everything in one search field.', { style: 'Title', color: 'text', width: 'FILL', name: 'Title' })

    // The selection: behind the tiles, gliding to the next one each second.
    const sel = k.rect(sheet, TW + 8, TH + 8, 'hit', { radius: 22, name: 'Selection', stroke: { color: 'g1', width: 2 }, effects: [halo(k, 'g1', 0.45, 36)], absolute: { x: at(0).x - 4, y: at(0).y - 4 } })
    const xs: { t: number; v: number; ease?: unknown }[] = [], ys: typeof xs = []
    for (let i = 0; i <= FEATURES.length; i++) {
      const p = at(i % FEATURES.length), p0 = at(0)
      const t = i * 1000
      // Hold on a tile, then a quick glide to the next (the last glide returns to the first).
      xs.push({ t, v: p.x - p0.x, ease: ease.hold }, { t: t + 760, v: p.x - p0.x, ease: ease.inOut('cubic') })
      ys.push({ t, v: p.y - p0.y, ease: ease.hold }, { t: t + 760, v: p.y - p0.y, ease: ease.inOut('cubic') })
    }
    k.animate(sel, 'translateX', xs.filter(kf => kf.t <= DUR) as never)
    k.animate(sel, 'translateY', ys.filter(kf => kf.t <= DUR) as never)

    FEATURES.forEach(([title, body, query, answer], i) => {
      const p = at(i)
      const tile = k.stack(sheet, { gap: 10, width: TW, height: TH, radius: 18, padding: 22, fill: 'panel', stroke: { color: 'line', width: 1 }, effects: [blackShadow(0.5, 16, 40)], name: 'Tile', absolute: p })
      k.text(tile, title, { style: 'Tile title', color: 'text', width: 'FILL', name: 'Tile title' })
      k.text(tile, body, { style: 'Tile body', color: 'dim', width: 'FILL', name: 'Tile body' })
      const pill = k.stack(tile, { direction: 'HORIZONTAL', gap: 10, align: 'CENTER', width: 'HUG', radius: 10, padding: { top: 7, right: 12, bottom: 7, left: 12 }, fill: 'glass2', name: 'Example' })
      k.text(pill, query, { style: 'Query', color: 'text', autoWidth: true, name: 'Example query' })
      k.text(pill, '=', { style: 'Query', color: 'g1', autoWidth: true, name: 'Arrow' })
      k.text(pill, answer, { style: 'Query', color: 'text', autoWidth: true, name: 'Example answer' })
    })
    // The selected tile's example pulses as the highlight lands on it.
    k.cues(sheet, FEATURES.map((_, i) => ({ layer: 'Example', preset: 'pulse', at: i * 1000 + 760, params: { duration: 360, amount: 0.05 } })).slice(0, 1).map(c => ({ ...c, stagger: { delay: 1000 } })))
    return k.finish()
  },
})
