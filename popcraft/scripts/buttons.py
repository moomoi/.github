#!/usr/bin/env python3
"""moo.moi's buttons (web/styles/site.css: .btn.go, .btn.ghost) as SVGs for the profile README, each its
own image so each can be its own link. Ghost buttons come in a dark and a light version (<picture>).
  python3 scripts/buttons.py  ->  ../profile/assets/buttons/<id>[-dark|-light].svg"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent.parent / 'profile' / 'assets' / 'buttons'
FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Helvetica, Arial, sans-serif"
DOWN = '<path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" fill="none" stroke="{c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
ARROW = '<path d="M5 12h14m0 0-6-6m6 6-6 6" fill="none" stroke="{c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
# id, label, style, icon
BUTTONS = [
    ('mac', 'Download for Mac', 'go', DOWN),
    ('windows', 'Download for Windows', 'go', DOWN),
    ('site', 'moo.moi', 'ghost', ARROW),
    ('docs', 'Docs', 'ghost', ARROW),
    ('marketplace', 'Marketplace', 'ghost', ARROW),
    ('plugin', 'Write a plugin', 'ghost', ARROW),
]
GLOW = 14  # room round a gradient pill for its glow; a glass pill needs only a hairline's


def width(label: str) -> int:
    # 16 px at weight 650: about 8.3 px a character, plus padding (24 each side), icon and gap (18 + 10).
    return round(len(label) * 8.3) + 48 + 26


def svg(label: str, style: str, icon: str, theme: str) -> str:
    PAD = GLOW if style == 'go' else 2
    w, h = width(label), 48
    W, H = w + 2 * PAD, h + 2 * PAD + (6 if style == 'go' else 0)
    if style == 'go':
        fg = '#FFFFFF'
        defs = ('<linearGradient id="g" x1="0" y1="0" x2="1" y2="0.36"><stop offset="0" stop-color="#FE588A"/>'
                '<stop offset="0.45" stop-color="#9B5BFF"/><stop offset="1" stop-color="#5B6EFF"/></linearGradient>'
                '<filter id="s" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#FE588A" flood-opacity="0.55"/></filter>')
        pill = (f'<rect x="{PAD}" y="{PAD}" width="{w}" height="{h}" rx="{h/2}" fill="url(#g)" filter="url(#s)"/>'
                f'<rect x="{PAD + 0.5}" y="{PAD + 0.5}" width="{w - 1}" height="{h - 1}" rx="{(h - 1)/2}" fill="none" stroke="#FFFFFF" stroke-opacity="0.22"/>')
    else:
        dark = theme == 'dark'
        fg = '#F4F4F6' if dark else '#0B0B10'
        fill, edge = ('#FFFFFF', '0.06') if dark else ('#FFFFFF', '0.9')
        stroke, sop = ('#FFFFFF', '0.16') if dark else ('#000000', '0.12')
        defs = ''
        pill = (f'<rect x="{PAD}" y="{PAD}" width="{w}" height="{h}" rx="{h/2}" fill="{fill}" fill-opacity="{edge}"/>'
                f'<rect x="{PAD + 0.5}" y="{PAD + 0.5}" width="{w - 1}" height="{h - 1}" rx="{(h - 1)/2}" fill="none" stroke="{stroke}" stroke-opacity="{sop}"/>')
    ix, iy = PAD + 24, PAD + (h - 18) / 2
    glyph = f'<g transform="translate({ix} {iy}) scale(0.75)">{icon.format(c=fg)}</g>'
    text = (f'<text x="{ix + 28}" y="{PAD + h / 2}" dominant-baseline="central" font-family="{FONT}" font-size="16" '
            f'font-weight="650" fill="{fg}">{label}</text>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{label}">'
            f'<defs>{defs}</defs>{pill}{glyph}{text}</svg>\n')


OUT.mkdir(parents=True, exist_ok=True)
for bid, label, style, icon in BUTTONS:
    if style == 'go':
        (OUT / f'{bid}.svg').write_text(svg(label, style, icon, 'dark'))
    else:
        for theme in ('dark', 'light'):
            (OUT / f'{bid}-{theme}.svg').write_text(svg(label, style, icon, theme))
print('\n'.join(sorted(p.name for p in OUT.iterdir())))
