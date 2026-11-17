# GirlonaMission

A personal portfolio built as a living tree: scroll from the seasonal canopy into four glowing project roots.

**Live website:** https://girlie-living-tree.marvelousoffer1.chatgpt.site

## Run locally

No build step or dependencies are required. With Python 3 installed, run:

```sh
python3 -m http.server 8000 --directory dist
```

Then visit http://localhost:8000.

## Project structure

- `dist/index.html`: page structure, music controls, and attribution dialog.
- `dist/style.css`: responsive layout and seasonal styling.
- `dist/app.js`: tree illustration, seasons, and configurable project roots.
- `dist/music.js`: opt-in playback, crossfades, volume and mute preferences, and background-tab pausing.
- `dist/audio/`: four soundtracks and their license records in `credits.json`.
- `.openai/hosting.json`: configuration for the existing Sites deployment.

## Configure the portfolio

Edit the `projects` array in `dist/app.js`. Each entry contains a title, description, URL, and root position. Replace a `null` URL with the project's destination to open it in a new tab. Unconfigured roots display a coming-soon dialog.

The four seasons are selected manually and remembered in the browser. Music starts only after the visitor presses play; volume and mute choices are also remembered. The monogram scrolls with the page, while season and music controls remain available.

## Music and licenses

All four recordings are by **Kevin MacLeod (incompetech.com)** and licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/):

| Season | Track |
| --- | --- |
| Spring | [Tafi Maradi no voice](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100740) |
| Summer | [Sunshine (version 2)](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100628) |
| Fall | [Folk Round](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100357) |
| Winter | [We Wish you a Merry Christmas](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100369) |

The files were re-encoded to 96 kbps MP3, loudness normalized, and given a short fade-in. Playback loops with a crossfade. Preserve the artist attribution, source and license links, and modification notices when redistributing the music. Full records are in `dist/audio/credits.json` and the site's **Music credits** dialog.

Typography uses Cormorant Garamond and DM Sans through Google Fonts.
