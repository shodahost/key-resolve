# Reference files

`assets/data.js` is checked against these files by `tools/verify_shortcuts.py`.

| file | what it is |
|---|---|
| `resolve-21.1-article-table.tsv` | The shortcut table of the DaVinci Resolve Club article *DaVinci Resolve keyboard shortcuts* (Resolve 21.1, default “DaVinci Resolve” preset, updated 2026-09-27), extracted with `tools/extract_article.py`. Columns: action, category, Windows keys, macOS keys, what it does — keys exactly as printed. |
| `resolve-21.1-article-text.tsv` | Shortcuts the same article gives in its running text rather than in the table (arrow keys, W, Forward Delete, Shift+2…8). Each row carries the exact sentence it comes from. `=` in the macOS column means the article gives one key for both systems. |

The article itself is not stored here (it is someone else's text). With a saved
copy you can re-check both files against it:

```bash
python3 tools/extract_article.py saved-article.html        # regenerate the table TSV
python3 tools/verify_shortcuts.py --article saved-article.html
```

## Optional: an export of Resolve's keyboard preset

The most direct source is Resolve itself: *DaVinci Resolve → Keyboard
Customization → options menu (…) → Export Preset*. Put the export here and list
it in `meta.keymaps` in `data.js`, e.g.

```json
"keymaps": {"win": "reference/resolve-21.1-default-win.txt", "mac": "reference/resolve-21.1-default-mac.txt"}
```

Items can then carry `"id"` — the internal command id from the export
(`controlPlayReverse`, `editLinkedSelection`, …) — and the verifier checks those
bindings as well. The export format is documented in `tools/resolve_keymap.py`.
Note that a preset based on another one stores only its differences
(`import "DaVinci Resolve"` followed by changed lines); the verifier refuses an
export without bindings.
