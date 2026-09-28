# DaVinci Resolve 21.1 Shortcuts — Cheat Sheet

An interactive DaVinci Resolve keyboard shortcut cheat sheet built for **learning**: keep it open on a second screen while you edit and pick up professional habits without memorising everything up front.

- **59 shortcuts** in 8 categories, including a *Help, I'm stuck!* section that maps classic beginner problems to the key that fixes them.
- **Up to date with DaVinci Resolve 21.1**, default “DaVinci Resolve” keyboard preset. **54 key assignments are checked automatically** (Windows/Linux *and* macOS keys) against the reference in [`reference/`](reference/README.md). The other 5 are built-in behaviours described in the same source, such as holding K while pressing J or L.
- **English + Polish.** Show EN, PL or both. Search works in either language, with or without Polish diacritics.

Plain static files: no build step, no dependencies. Opening `index.html` straight from disk works too.

## Features for learners

| | |
|---|---|
| 🎯 **Levels** | Every shortcut is tagged *Start* (first days), *Core* (everyday) or *Pro*. Filter with the level switch in the toolbar. |
| 🚀 **Start here** | Four habits to master first: play & mark, cut at the playhead, trim & move between edits, stay oriented. |
| 🆘 **Help, I'm stuck!** | Problem → key: every click cuts, snapping jumps, J/K/L trim instead of playing, export covers only part of the timeline… |
| 💡 **Pro tips** | Workflow tips in every category, plus hints under individual shortcuts. |
| ✅ **Progress** | Mark shortcuts as learned. Progress is shown per category and overall, and you can hide what you already know. |
| ★ **My sheet** | Pin shortcuts to build a small personal sheet for the current project. |
| 🎴 **Flashcards** | Quiz yourself on the current view: action → keys or keys → action. “Knew it” marks the card as learned. |
| 🔍 **Smart search** | Search by words (`ripple`, `przetnij`) or by keys (`ctrl \`, `shift z`, `f9`, `cmd shift l`). |
| ⌨️ **Windows / Linux / macOS** | On macOS, keys are shown as ⌘ / ⌥ / ⇧ and checked against the macOS column of the reference. |
| ⚙️ **Set up Resolve for learning** | Cards for the keyboard preset, your own preset, Free vs Studio, laptop F-keys, project settings, proxy/optimized media and render cache. |
| 🖥 **Second-screen friendly** | Compact density, a collapsible header, a sticky toolbar, light/dark/auto themes, and shareable URLs (`#c=trimming`, `#q=ripple`). |
| 🖨 **Print / PDF** | A clean print layout for a paper copy. |

Settings, progress and pins are saved in your browser (`localStorage`). Studio-only features would get a **Studio** badge; none of the shortcuts here needs Studio — Keyboard Customization and the editing commands work in both editions.

> Keys act on the page and panel that has focus. Premiere Pro, Final Cut Pro and Avid presets assign keys differently, so check the active preset in *DaVinci Resolve → Keyboard Customization*.

## Project layout

```
index.html                  page skeleton
assets/styles.css           styles (dark/light, compact, print)
assets/app.js               rendering, search, filters, progress, flashcards
assets/data.js              all shortcuts (the single source for the page)
reference/                  what data.js is checked against (see reference/README.md)
tools/verify_shortcuts.py   checks data.js against reference/, rewrites it in a stable format
tools/extract_article.py    extracts the reference table from a saved copy of the article
tools/resolve_keymap.py     parser for exports of Resolve's keyboard preset (optional source)
```

### Data format (`assets/data.js`)

`data.js` assigns a JSON object to `window.KB_DATA`, formatted with one shortcut per line. A shortcut looks like this:

```json
{"k": "Ctrl+Backslash", "en": "Split clip at the playhead", "pl": "Przetnij klip w miejscu głowicy", "l": 1,
 "h": {"en": "Cuts without changing the pointer mode…", "pl": "Tnie bez zmiany trybu kursora…"},
 "cmd": "Split Clip at playhead"}
```

| field | meaning |
|---|---|
| `k` | Keys, Windows/Linux names. `+` joins a chord, `\|` separates alternatives (`Up\|Down`), a space means “then” (`M M`). Tokens: `Ctrl Alt Shift Meta`, `A`–`Z`, `0`–`9`, `F1`–`F24`, `Tab Space Enter Esc Del Backspace Home End PgUp PgDn Up Down Left Right`, `Num0`–`Num9 NumDot NumPlus NumMinus NumSlash NumStar NumEnter`, `Grave Comma Period Slash Backslash Semicolon Quote LBracket RBracket Minus Equal`, mouse `LMB RMB MMB Wheel`, the suffix `-Drag`, the prefix `2x`. A plain key before `+` means “hold it” (`K+L`). |
| `mk` | Optional macOS keys when they are not simply `k` with Ctrl → ⌘ and Alt → ⌥ (`Meta` is the ⌃ Control key). |
| `en`, `pl` | The action in English and Polish. |
| `l` | Level: 1 = Start, 2 = Core, 3 = Pro. |
| `h` | Optional hint (`en` / `pl`). |
| `cmd` | The action name **exactly as in the reference files** (or a list with one name per alternative). The verifier checks the keys against it. |
| `hc` | `1` for a built-in behaviour described in the source text but not given as a key assignment (e.g. holding K). Needs `src`. |
| `src` | Where a built-in behaviour (or setup card) comes from — the article section. |
| `st` | `1` for a DaVinci Resolve Studio-only feature (shows a **Studio** badge). |
| `id` | Optional internal Resolve command id from a keyboard preset export (see [`reference/README.md`](reference/README.md)). |

## Verifying (and updating to a newer Resolve)

```bash
python3 tools/verify_shortcuts.py            # verify; exit code ≠ 0 on any mismatch
python3 tools/verify_shortcuts.py --write    # also rewrite data.js in the stable format
python3 tools/verify_shortcuts.py --find "Ctrl+Backslash"
python3 tools/verify_shortcuts.py --article saved-article.html   # re-check reference/ against the article
```

Python 3 standard library only. There is deliberately **no CI** — run it locally after editing `data.js`. It checks that:

- every `cmd` exists in a reference file, and `k` matches its Windows column and `mk`/`k` its macOS column,
- every `hc` item has a `src`, every key token is valid, nothing is duplicated,
- nothing is left unverified (such items are listed as *to check / do sprawdzenia* and fail the run),
- with `--article`, the table TSV still matches the article and every quoted sentence is really in it,
- with `meta.keymaps`, every `id` is bound to those keys in the exported preset.

It prints how many shortcuts are verified and how many are built-in (`hc`).

To move to a new Resolve release:

1. Get a new reference: an updated version of the article (run `tools/extract_article.py`, update `reference/…-text.tsv`), and/or an export of the default keyboard preset (*Keyboard Customization → … → Export Preset*, Windows and macOS) listed in `meta.keymaps`.
2. Point `meta.reference` / `meta.keymaps` to the new files and bump `meta.resolve` and `meta.label`.
3. Run `python3 tools/verify_shortcuts.py`, fix whatever it reports, then run it with `--write`.

### Scope

The reference covers the Edit-page essentials, pages and project commands. Page-specific shortcuts for Fusion, Color (nodes, stills, wipes), Fairlight and Deliver are **not** listed, because the reference doesn't give them — they will be added once a keyboard preset export (or another verifiable source) is in `reference/`.

### What was wrong in the previous version

Checked against the reference:

- **↑ / ↓** were listed as previous/next *marker* — they move to the previous/next **edit**.
- Pages were **Ctrl+1–7** (also in the Top 5) — the default is **Shift+2 … Shift+8** (Media … Deliver).
- Trim start/end to playhead were **Ctrl+Shift+[ / ]** — the default is **Shift+[ / Shift+]**.
- “Hold K+L = frame stepping” mixed two things up: holding **K+L** plays slowly forward, **holding K and tapping J/L** steps one frame.
- The shortcut total was inflated by 5 (the J/K/L box was counted twice).
- The macOS note only mentioned Cmd; Alt is ⌥ Option (e.g. Alt+Y → ⌥+Y).
- Not confirmed by the reference and therefore removed: Ctrl+B (the documented cut at the playhead is **Split Clip, Ctrl+\\**), Backspace, X, Alt+X, Shift+M (the reference opens marker details with a second **M**), Shift+←/→, Home/End, Ctrl+Shift+ +/−, the Color page shortcuts (Alt+S/P/L, Ctrl+D, Ctrl+Shift+C/V, Shift+H) and the exact “2× · 4× · 8×” shuttle speeds.
- Missing essentials added: Split Clip, Insert/Overwrite/Replace/Place on Top/Fit to Fill/Append (F9–F12), snapping (N), enable/disable clip (D), linked selection, Dynamic Trim (W), extend edit (E), select forward (Y), ripple cut.
- Also: the search didn't fold Polish diacritics or understand keys, there was no favicon or manifest, and no version was stated.

## Po polsku

Interaktywna ściąga skrótów **DaVinci Resolve 21.1** do nauki: trzymaj ją na drugim ekranie, filtruj według poziomu (Start / Podstawy / Pro), zaznaczaj nauczone skróty, przypinaj własną „Moją ściągę”, ucz się z fiszek (w obie strony) i szukaj po polsku (także bez ogonków) lub po klawiszach (`ctrl \`, `shift z`). Przełącznik pokazuje klawisze dla Windows/Linux albo macOS.

**Źródło i weryfikacja.** Kod Resolve jest zamknięty, więc ściąga opiera się na pliku referencyjnym w `reference/`: tabeli i tekście artykułu DaVinci Resolve Club dla Resolve 21.1 (domyślny preset „DaVinci Resolve”). Skrypt `python3 tools/verify_shortcuts.py` (tylko biblioteka standardowa) sprawdza każdy skrót z `data.js` z tą referencją — osobno klawisze Windows/Linux i macOS — i kończy się kodem ≠ 0 przy rozbieżności. Obecnie: **59 skrótów, 54 zweryfikowane, 5 wbudowanych zachowań** (`hc`, ze wskazaną sekcją źródła), 0 do sprawdzenia. Nie ma GitHub Actions — weryfikator uruchamiasz lokalnie.

**Aktualizacja do nowej wersji:** dodaj nowy plik referencyjny (nowa wersja artykułu przez `tools/extract_article.py` albo eksport domyślnego presetu z *Keyboard Customization → … → Export Preset*, najlepiej Win i Mac, wpisany w `meta.keymaps`), zmień `meta.resolve` / `meta.label`, uruchom weryfikator i popraw, co zgłosi, na końcu `--write`.

**Zakres:** źródło obejmuje podstawy strony Edit, przełączanie stron i polecenia projektu. Skrótów stron Fusion, Color, Fairlight i Deliver nie ma, bo referencja ich nie podaje — dojdą, gdy w `reference/` pojawi się eksport presetu klawiatury.
