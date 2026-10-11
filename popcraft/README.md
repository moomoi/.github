# Profile animations

The animated pictures in [profile/assets](../profile/assets) are [PopCraft](https://popcraft.app) templates,
written with `@popcraft/kit` and rendered with the `popcraft` command line.

| Template | Picture |
| --- | --- |
| [templates/hero.ts](templates/hero.ts) | `hero.webp`: the cow, the wordmark, and a launcher answering four queries (8 s) |
| [templates/features.ts](templates/features.ts) | `features.webp`: six features, the selection stepping through them (6 s) |
| [templates/plugins.ts](templates/plugins.ts) | `plugins.webp`: the eight built-in plugins on two drifting rows (8 s) |
| [templates/install.ts](templates/install.ts) | `install.webp`: the Homebrew install in a terminal (7 s) |

Colours and the icon come from moo.moi ([shared/brand.ts](shared/brand.ts)).

## Render

Needs Node 24, the PopCraft app running locally (it draws the frames), `ffmpeg` and `img2webp`
(`brew install ffmpeg webp`), and `@popcraft/kit` beside the templates.

```sh
./pc.sh template look templates/hero.ts --at 0,2600       # stills to look at, in build/<id>/look
scripts/render.sh hero features install                  # → ../profile/assets/<name>.webp
WIDTH=1024 FPS=20 Q=60 scripts/render.sh plugins         # the busiest one, smaller
```

`APP_URL` points the renderer at the app (default `http://localhost:3137`); `POPCRAFT_CLI` at the
command line's `popcraft.mjs`.
