# Reference material — Ghazi Oriental

`ghazi-brand-film.mp4` is the original 8-second brand film, untouched, at full
quality. Everything gold in the site is derived from it:

| Derived file | How |
|---|---|
| `../../ghazi-oriental/assets/video/film.mp4` | denoised, 500 px wide, 20 fps, H.264 |
| `../../ghazi-oriental/assets/video/film.webm` | same, VP9, for browsers without H.264 |
| `../../ghazi-oriental/assets/img/mandala.png` | the arabesque at 5.1 s, keyed off its black ground |
| `../../ghazi-oriental/assets/img/ghazi-wordmark.png` | the wordmark from the end card, keyed the same way |

The wordmark and mandala were lifted from video frames, so they top out around
480 px and 600 px wide. If you have the original artwork — a transparent PNG or
an SVG of the Ghazi Oriental lockup and the mandala — drop them in over these
two files under the same names and the site will sharpen everywhere at once.

`stills/` holds six frames at the film's key moments, for social posts and
anywhere you need a still rather than the film.

Re-encode from `ghazi-brand-film.mp4`, never from `film.mp4` — the shipped one
is already compressed.
