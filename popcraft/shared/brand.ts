// Moo's look, from moo.moi (web/styles/site.css in moomoi/moo): a near-black sky, glass panels with a
// hairline edge, and the pink → purple → blue gradient. Every profile picture is 1280 wide, GitHub's
// README column at 2×.

import type { Kit } from '@popcraft/kit/templates/kit'

export const W = 1280
export const ICON = new URL('../assets/moo-icon.png', import.meta.url)

export const COLORS = {
  paper: '#07070A',
  text: '#F4F4F6',
  dim: '#8B8B96',
  faint: '#4A4A55',
  g1: '#FE588A',
  g2: '#5B6EFF',
  g3: '#9B5BFF',
}

/** Brand roles (text on the dark ground) and the fixed scenery colours. */
export function mooBrand(k: Kit) {
  k.brand({ paper: COLORS.paper, text: COLORS.text, primary: COLORS.g1, onPrimary: '#FFFFFF', card: '#14141B', onCard: COLORS.text }, { name: 'Moo', site: 'moo.moi' })
  k.palette({
    dim: COLORS.dim,
    faint: COLORS.faint,
    g1: COLORS.g1,
    g2: COLORS.g2,
    g3: COLORS.g3,
    // Glass on the dark sky: the panel, a lighter chip, the hairline edge, the selected row.
    panel: '#14141CF2',
    glass2: '#FFFFFF14',
    line: '#FFFFFF17',
    edge: '#FFFFFF2E',
    hit: '#FE588A24',
    hitEdge: '#FE588A55',
  })
}
