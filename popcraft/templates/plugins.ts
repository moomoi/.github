// moomoi/plugins (1280 × 480, an 8 s loop): the eight plugins that ship with Moo, on two rows of cards drifting
// past in opposite directions. Each row is its cards twice over, moved exactly one set's width in 8 s, so the
// loop is seamless.

import { Kit, preset } from '@popcraft/kit/templates/kit'
import { defineTemplate } from '@popcraft/kit/templates/build'
import { glow, blackShadow } from '@popcraft/kit/templates/shared/texture'
import { dotPaths } from '@popcraft/kit/templates/shared/marks'
import { ease } from '@popcraft/kit'
import { mooBrand, W } from '../shared/brand.ts'

const H = 480
const DUR = 8000
// Name, what it does (from each plugin's own commands), its badge and colour.
const PLUGINS: [string, string, string, string][] = [
  ['Dev Toolbox', 'Base64, JWTs, JSON, timestamps, hashes', 'DT', 'g1'],
  ['GitHub', 'Repos, pull requests, issues', 'GH', 'g3'],
  ['Package Search', 'npm, crates, Homebrew, PyPI', 'PS', 'g2'],
  ['Weather', 'Now and the next 7 days', 'WX', 'g1'],
  ['Slack', 'Channels, people, messages', 'SL', 'g3'],
  ['Unit Converter', '10 km, 72 f, 3 lb, 512 mib', 'UC', 'g2'],
  ['Moo Utils', 'UUIDs, emoji, developer links', 'MU', 'g1'],
  ['Hello List', 'The starter: lists, views, actions', 'HL', 'g3'],
]
const CW = 344, CH = 104, GAP = 20, SET = PLUGINS.length * (CW + GAP)

export default defineTemplate({
  id: 'moomoi-plugins',
  meta: {
    name: 'Moo plugins',
    description: 'The eight plugins that ship with Moo, drifting past on two rows. An 8 s seamless loop for the moomoi GitHub profile.',
    category: 'animation', tags: ['animation', 'github', 'plugins', 'moo'],
    platforms: ['github'], formats: ['banner', 'gif'], useCases: ['education'],
    created: '2026-10-10', updated: '2026-10-10',
  },
  build() {
    const k = new Kit('Moo plugins', { ...preset('github-social'), height: H })
    mooBrand(k)
    k.textStyle('Kicker', { size: 15, fontWeight: 700, letterSpacing: 2, lineHeight: 20, fontFamily: 'JetBrains Mono' })
    k.textStyle('Title', { size: 44, fontWeight: 800, letterSpacing: -1.4, lineHeight: 52 })
    k.textStyle('Name', { size: 21, fontWeight: 700, letterSpacing: -0.2, lineHeight: 26 })
    k.textStyle('Body', { size: 15, fontWeight: 400, lineHeight: 21 })
    k.textStyle('Badge', { size: 16, fontWeight: 800, lineHeight: 20, fontFamily: 'JetBrains Mono' })
    k.textStyle('Foot', { size: 16, fontWeight: 500, lineHeight: 22, fontFamily: 'JetBrains Mono' })

    const sheet = k.sheet
    k.flowSheet(sheet, 0, 0, 'paper')
    k.patch(sheet, { clipsContent: true })
    k.timeline(sheet, { duration: DUR, fps: 30 })
    const light = glow(k, sheet, { x: W * 0.8, y: 60, w: 1000, role: 'g2', alpha: 0.24, name: 'Light' })
    k.behave(light, 'opacity', [{ kind: 'sine', amp: 0.12, freq: 1 / (DUR / 1000) }])
    k.vector(sheet, W, H, dotPaths(W, H, 28, 1.2), 'line', { name: 'Dots', absolute: { x: 0, y: 0 } })

    const head = k.stack(sheet, { gap: 8, width: W - 128, name: 'Heading', absolute: { x: 64, y: 44 } })
    k.text(head, 'MOOMOI/PLUGINS', { style: 'Kicker', color: 'g1', autoWidth: true, name: 'Kicker' })
    k.text(head, 'Eight built in. Write your own in Tish.', { style: 'Title', color: 'text', width: 'FILL', name: 'Title' })

    // Two rows, each its cards twice over, drifting one set's width in the loop: left, then right.
    const row = (y: number, order: typeof PLUGINS, dir: 1 | -1, name: string, x = 0) => {
      const strip = k.frame(sheet, { x, y, width: 2 * SET, height: CH + 20 }, { name })
      const list = [...order, ...order]
      list.forEach(([title, body, badge, role], i) => {
        const card = k.stack(strip, { direction: 'HORIZONTAL', gap: 16, align: 'CENTER', width: CW, height: CH, radius: 18, padding: { top: 0, right: 18, bottom: 0, left: 18 }, fill: 'panel', stroke: { color: 'line', width: 1 }, effects: [blackShadow(0.5, 12, 30)], name: 'Card', absolute: { x: i * (CW + GAP), y: 6 } })
        const b = k.stack(card, { direction: 'HORIZONTAL', width: 52, height: 52, radius: 14, align: 'CENTER', justify: 'CENTER', fill: role, name: 'Badge' })
        k.text(b, badge, { style: 'Badge', color: 'text', autoWidth: true })
        const words = k.stack(card, { gap: 4, width: 'FILL', name: 'Words' })
        k.text(words, title, { style: 'Name', color: 'text', width: 'FILL', name: 'Plugin name' })
        k.text(words, body, { style: 'Body', color: 'dim', width: 'FILL', name: 'Plugin body' })
      })
      // Left: from 0 to -SET. Right: from -SET to 0. Linear, so the seam never shows.
      const [from, to] = dir < 0 ? [0, -SET] : [-SET, 0]
      k.animate(strip, 'translateX', [{ t: 0, v: from, ease: ease.linear }, { t: DUR, v: to }])
    }
    row(176, PLUGINS, -1, 'Row one')
    // Half a card along, so the two rows never line up as they pass.
    row(300, [...PLUGINS].reverse(), 1, 'Row two', -(CW + GAP) / 2)

    k.text(sheet, 'Each runs in its own sandboxed VM, with no file or network access beyond the hosts it declares.', { style: 'Foot', color: 'dim', width: W - 128, name: 'Foot', absolute: { x: 64, y: 436 } })
    return k.finish()
  },
})
