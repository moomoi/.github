// Getting Moo (1280 × 400, a 7 s loop): a terminal types the Homebrew install, Homebrew answers line by line,
// and the last line says what to press. It clears before the end, so the loop begins on an empty prompt again.

import { Kit, preset } from '@popcraft/kit/templates/kit'
import { defineTemplate } from '@popcraft/kit/templates/build'
import { glow, blackShadow } from '@popcraft/kit/templates/shared/texture'
import { dotPaths } from '@popcraft/kit/templates/shared/marks'
import { mooBrand, W } from '../shared/brand.ts'

const H = 400
const DUR = 7000
const CMD = 'brew install moomoi/moo/moo'
const OUTPUT: [string, string][] = [
  ['==> ', 'Downloading Moo-macos-universal.dmg'],
  ['==> ', 'Installing Cask moo'],
  ['==> ', 'Moving App \'Moo.app\' to \'/Applications/Moo.app\''],
]

export default defineTemplate({
  id: 'moomoi-install',
  meta: {
    name: 'Get Moo',
    description: 'A terminal installs Moo with Homebrew, then says what to press. A 7 s loop for the moomoi GitHub profile.',
    category: 'animation', tags: ['animation', 'github', 'terminal', 'moo'],
    platforms: ['github'], formats: ['banner', 'gif'], useCases: ['launch'],
    created: '2026-10-10', updated: '2026-10-10',
  },
  build() {
    const k = new Kit('Get Moo', { ...preset('github-social'), height: H })
    mooBrand(k)
    k.textStyle('Mono', { size: 22, fontWeight: 500, lineHeight: 34, fontFamily: 'JetBrains Mono' })
    k.textStyle('Mono bold', { size: 22, fontWeight: 800, lineHeight: 34, fontFamily: 'JetBrains Mono' })
    k.textStyle('Bar', { size: 14, fontWeight: 600, lineHeight: 18, fontFamily: 'JetBrains Mono' })
    k.textStyle('Punch', { size: 30, fontWeight: 800, letterSpacing: -0.6, lineHeight: 38 })

    const sheet = k.sheet
    k.flowSheet(sheet, 0, 0, 'paper')
    k.patch(sheet, { clipsContent: true })
    k.timeline(sheet, { duration: DUR, fps: 30 })
    const light = glow(k, sheet, { x: W / 2, y: H, w: 1200, role: 'g1', alpha: 0.22, name: 'Light' })
    k.behave(light, 'opacity', [{ kind: 'sine', amp: 0.1, freq: 1 / (DUR / 1000) }])
    k.vector(sheet, W, H, dotPaths(W, H, 28, 1.2), 'line', { name: 'Dots', absolute: { x: 0, y: 0 } })

    // The terminal window.
    const TW = 980
    const term = k.stack(sheet, { width: TW, height: 316, radius: 18, fill: 'panel', stroke: { color: 'edge', width: 1.5 }, clip: true, effects: [blackShadow(0.6, 24, 60)], name: 'Terminal', absolute: { x: (W - TW) / 2, y: 42 } })
    const bar = k.stack(term, { direction: 'HORIZONTAL', gap: 8, align: 'CENTER', width: 'FILL', height: 40, padding: { top: 0, right: 16, bottom: 0, left: 16 }, fill: 'glass2', name: 'Title bar' })
    k.palette({ close: '#FF5F57', min: '#FEBC2E', zoom: '#28C840' })
    for (const c of ['close', 'min', 'zoom']) k.ellipse(bar, 12, c, { name: 'Window button' })
    k.text(bar, '~ zsh', { style: 'Bar', color: 'dim', width: 'FILL', align: 'CENTER', name: 'Bar title' })
    const body = k.stack(term, { gap: 2, width: 'FILL', padding: { top: 18, right: 26, bottom: 18, left: 26 }, name: 'Body' })
    const prompt = k.stack(body, { direction: 'HORIZONTAL', gap: 12, width: 'FILL', name: 'Prompt' })
    k.text(prompt, '$', { style: 'Mono bold', color: 'g1', autoWidth: true })
    k.text(prompt, CMD, { style: 'Mono', color: 'text', autoWidth: true, name: 'Command' })
    for (const [lead, line] of OUTPUT) {
      const row = k.stack(body, { direction: 'HORIZONTAL', width: 'FILL', name: 'Output' })
      k.text(row, lead, { style: 'Mono bold', color: 'g2', autoWidth: true })
      k.text(row, line, { style: 'Mono', color: 'dim', autoWidth: true })
    }
    const done = k.stack(body, { direction: 'HORIZONTAL', gap: 12, width: 'FILL', padding: { top: 14, right: 0, bottom: 0, left: 0 }, name: 'Done' })
    k.text(done, 'Moo is installed.', { style: 'Mono bold', color: 'text', autoWidth: true })
    k.text(done, 'Press Option Space. Then type anything.', { style: 'Mono', color: 'g1', autoWidth: true, name: 'Done line' })

    // Type, answer, hold, clear.
    k.cues(sheet, [
      { layer: 'Command', preset: 'typewriter', at: 300, params: { duration: 1300 } },
      { layer: 'Output', preset: 'fade-in', at: 1900, stagger: { delay: 380 } },
      { layer: 'Done', preset: 'rise-in', at: 3300 },
      { layer: 'Done line', preset: 'pulse', at: 4300, params: { duration: 500, amount: 0.04 } },
      { layer: 'Output', preset: 'fade-out', at: 6300, stagger: { delay: 0 } },
      { layer: 'Done', preset: 'fade-out', at: 6300 },
      { layer: 'Command', preset: 'fade-out', at: 6300 },
    ])
    return k.finish()
  },
})
