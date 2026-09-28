#!/usr/bin/env python3
"""
Verify assets/data.js against the reference files in reference/.

Resolve is closed source, so data.js is only as good as its reference. The
reference for this version of the cheat sheet is the DaVinci Resolve Club
article "DaVinci Resolve keyboard shortcuts" (Resolve 21.1, updated
2026-09-27), stored as two tab-separated files (see meta.reference):

  reference/resolve-21.1-article-table.tsv  the article's table, extracted by
                                            tools/extract_article.py
  reference/resolve-21.1-article-text.tsv   shortcuts the article gives in its
                                            text, with the exact quote

Every shortcut in data.js is one of:

  * "cmd" - the action name(s) exactly as in a reference file (one per key
            alternative, or one for all). The script checks that the keys in
            "k" match the Windows column and that the macOS keys ("mk", or
            "k" shown with Cmd/Option) match the macOS column.
  * "hc"  - built-in behaviour described in the article's text but not given
            as a key assignment (holding K, typing into a field...). Needs
            "src", the article section it comes from. Only key tokens are checked.

Optionally an item can carry "id", the internal Resolve command id from an
export of the default keyboard preset (Keyboard Customization -> ... ->
Export Preset). When meta.keymaps points to such exports in reference/,
those ids are checked too (format: tools/resolve_keymap.py).

Anything that is neither verified nor "hc" is reported as "to check"
("do sprawdzenia") and makes the script fail.

Usage:
  python3 tools/verify_shortcuts.py                        # verify, exit != 0 on problems
  python3 tools/verify_shortcuts.py --write                # also rewrite data.js in the stable format
  python3 tools/verify_shortcuts.py --article saved.html   # also re-check the reference files against the article
  python3 tools/verify_shortcuts.py --find "Ctrl+Backslash" # what uses a key

Only the Python standard library is used. It is meant to run locally
(there is deliberately no CI).
"""

import argparse
import datetime
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import resolve_keymap as rk  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(ROOT, "assets", "data.js")
DATA_PREFIX = "window.KB_DATA = "
ITEM_KEYS = ("k", "mk", "en", "pl", "l", "h", "st", "cmd", "id", "hc", "src")


# ---------------------------------------------------------------- data.js I/O

def read_data():
    with open(DATA_JS, encoding="utf-8") as f:
        src = f.read().strip()
    if not src.startswith(DATA_PREFIX):
        sys.exit(f"{DATA_JS}: expected to start with '{DATA_PREFIX}'")
    return json.loads(src[len(DATA_PREFIX):].rstrip(";"))


def dumps_compact(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(", ", ": "))


def ordered_item(it):
    out = {k: it[k] for k in ITEM_KEYS if k in it}
    out.update({k: v for k, v in it.items() if k not in out})
    return out


def write_data(data):
    """Stable, diff-friendly formatting: one shortcut per line."""
    out = [DATA_PREFIX + "{"]
    keys = list(data.keys())
    for i, k in enumerate(keys):
        comma = "," if i < len(keys) - 1 else ""
        if k != "categories":
            if isinstance(data[k], list):
                out.append(f'  "{k}": [')
                for j, e in enumerate(data[k]):
                    out.append("    " + dumps_compact(e) + ("," if j < len(data[k]) - 1 else ""))
                out.append("  ]" + comma)
            else:
                out.append(f'  "{k}": ' + dumps_compact(data[k]) + comma)
            continue
        out.append('  "categories": [')
        cats = data[k]
        for ci, cat in enumerate(cats):
            out.append("    {")
            for ck in (ck for ck in cat if ck != "groups"):
                out.append(f'      "{ck}": ' + dumps_compact(cat[ck]) + ",")
            out.append('      "groups": [')
            for gi, g in enumerate(cat["groups"]):
                out.append("        {")
                for gk in (gk for gk in g if gk != "items"):
                    out.append(f'          "{gk}": ' + dumps_compact(g[gk]) + ",")
                out.append('          "items": [')
                for ii, it in enumerate(g["items"]):
                    out.append("            " + dumps_compact(ordered_item(it)) + ("," if ii < len(g["items"]) - 1 else ""))
                out.append("          ]")
                out.append("        }" + ("," if gi < len(cat["groups"]) - 1 else ""))
            out.append("      ]")
            out.append("    }" + ("," if ci < len(cats) - 1 else ""))
        out.append("  ]" + comma)
    out.append("};")
    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


# ---------------------------------------------------------------- helpers

def alts(keys):
    """'Ctrl+B|Ctrl+Backslash' -> ['Ctrl+B', 'Ctrl+Backslash']"""
    return keys.split("|")


def chords(alt):
    """A sequence 'M M' -> ['M', 'M']"""
    return alt.split(" ")


def read_tsv(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        lines = [ln.rstrip("\n") for ln in f if ln.strip()]
    head = lines[0].split("\t")
    return [dict(zip(head, ln.split("\t"))) for ln in lines[1:]]


def load_reference(meta, errors):
    """action name -> {'win': canonical|None, 'mac': canonical|None, 'file': path, 'row': dict}"""
    ref = {}
    for kind, path in meta.get("reference", {}).items():
        if not os.path.exists(os.path.join(ROOT, path)):
            errors.append(f"reference file {path} not found")
            continue
        for row in read_tsv(path):
            name = row["action"]
            if name in ref:
                errors.append(f"{path}: action {name!r} listed twice")
            win = rk.normalize_article_keys(row["windows"])
            mac = win if row["macos"] == "=" else rk.normalize_article_keys(row["macos"])
            ref[name] = {"win": win, "mac": mac, "file": path, "kind": kind, "row": row}
    return ref


def load_export(path):
    full = os.path.join(ROOT, path)
    if not os.path.exists(full):
        return None
    km = rk.parse_export(full)
    if not km["bindings"]:
        raise rk.KeymapError(
            f"{path}: no key bindings found (imports: {km['imports']}). Export the full default preset, "
            "not a preset that only stores changes.")
    return km


def article_text(path):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    src = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", src, flags=re.S)
    src = re.sub(r"<[^>]+>", " ", src)
    return norm_text(html.unescape(src))


def norm_text(s):
    s = s.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip().lower()


def check_tokens(it):
    for field in ("k", "mk"):
        if field in it:
            for alt in alts(it[field]):
                for ch in chords(alt):
                    rk.normalize_data_chord(ch)


def per_alt(value, n):
    if isinstance(value, list):
        return value if len(value) == n else None
    return [value] * n


def check_ref(it, ref):
    """Problems of an item with "cmd" against the article reference."""
    problems = []
    win_alts = alts(it["k"])
    mac_alts = alts(it["mk"]) if it.get("mk") else win_alts
    names = per_alt(it["cmd"], len(win_alts))
    if names is None or len(mac_alts) != len(win_alts):
        return [f"{len(win_alts)} key alternatives, but cmd/mk do not have the same count"]
    for name, walt, malt in zip(names, win_alts, mac_alts):
        row = ref.get(name)
        if not row:
            problems.append(f"action {name!r} is not in the reference files")
            continue
        if row["win"] is None:
            problems.append(f"the reference gives no key for {name!r} ({row['row']['windows']!r})")
            continue
        if len(chords(walt)) != 1 or len(chords(malt)) != 1:
            problems.append(f"'{walt}': key sequences are not in the reference")
            continue
        win = rk.normalize_data_chord(walt)
        mac = rk.normalize_data_chord(malt)
        if win != row["win"]:
            problems.append(f"Windows: '{walt}' but {row['file']} says {name!r} = {row['row']['windows']!r}")
        if mac != row["mac"]:
            problems.append(f"macOS: '{malt}' but {row['file']} says {name!r} = {row['row']['macos']!r}")
    return problems


def check_id(it, km, platform):
    problems = []
    keys = alts(it["mk"] if platform == "mac" and it.get("mk") else it["k"])
    ids = per_alt(it["id"], len(keys))
    if ids is None:
        return [f"{len(keys)} key alternatives but {len(it['id'])} command ids"]
    for cmd, alt in zip(ids, keys):
        want = rk.normalize_data_chord(chords(alt)[0])
        if cmd not in km["bindings"]:
            why = "has no key" if cmd in km["unbound"] else "is not in the export"
            problems.append(f"[{platform} export] command {cmd} {why}")
        elif want not in km["bindings"][cmd]:
            problems.append(f"[{platform} export] '{alt}' is not bound to {cmd} (bound: {' | '.join(km['bindings'][cmd])})")
    return problems


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write", action="store_true", help="rewrite data.js in the stable format and update meta")
    ap.add_argument("--article", metavar="HTML", help="saved copy of the article: re-check the reference files against it")
    ap.add_argument("--find", metavar="KEYS", help="list reference actions and data.js items using KEYS (e.g. Ctrl+Backslash)")
    args = ap.parse_args()

    data = read_data()
    meta = data["meta"]
    errors, warnings = [], []
    ref = load_reference(meta, errors)
    print(f"reference: {len(ref)} actions from {', '.join(meta.get('reference', {}).values())}")

    exports = {}
    for platform, path in meta.get("keymaps", {}).items():
        try:
            km = load_export(path)
        except rk.KeymapError as ex:
            errors.append(str(ex))
            continue
        if km is None:
            warnings.append(f"{platform} export {path} not found — 'id' fields not checked")
            continue
        exports[platform] = km
        print(f"{platform} export: {path} — {len(km['bindings'])} bound commands")

    if args.article:
        text = article_text(args.article)
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import extract_article
        fresh = extract_article.extract(args.article)
        table = meta["reference"].get("table")
        rows = [[r[h] for h in extract_article.HEADER] for r in read_tsv(table)] if table else []
        if fresh != rows:
            errors.append(f"{table} differs from the article table (re-run tools/extract_article.py)")
        for name, r in ref.items():
            q = r["row"].get("quote")
            if q and norm_text(q) not in text:
                errors.append(f"{r['file']}: quote for {name!r} not found in the article: {q!r}")
        print("article: table and quotes re-checked")

    if args.find:
        want = rk.normalize_data_chord(args.find)
        for name, r in ref.items():
            if want in (r["win"], r["mac"]):
                print(f"reference: {name} ({r['row']['windows']} / {r['row']['macos']})")
        for cat in data["categories"]:
            for g in cat["groups"]:
                for it in g["items"]:
                    if any(rk.normalize_data_chord(ch) == want for a in alts(it["k"]) for ch in chords(a)):
                        print(f"data.js [{cat['id']}]: {it['k']} — {it['en']}")
        return

    n_ok = n_hc = n_id = 0
    todo, used = [], set()
    seen = set()
    for cat in data["categories"]:
        for g in cat["groups"]:
            for it in g["items"]:
                label = f"[{cat['id']}] {it['k']} — {it['en']}"
                ident = (cat["id"], it["k"], it["en"])
                if ident in seen:
                    errors.append(f"{label}: duplicate entry")
                seen.add(ident)
                try:
                    check_tokens(it)
                except rk.KeymapError as ex:
                    errors.append(f"{label}: {ex}")
                    continue
                if it.get("l") not in (1, 2, 3):
                    errors.append(f"{label}: level 'l' must be 1, 2 or 3")
                for f in ("en", "pl"):
                    if not it.get(f):
                        errors.append(f"{label}: missing '{f}'")
                if it.get("cmd") and it.get("hc"):
                    errors.append(f"{label}: an item is either 'cmd' or 'hc', not both")
                if it.get("id"):
                    for platform, km in exports.items():
                        probs = check_id(it, km, platform)
                        errors.extend(f"{label}: {p}" for p in probs)
                        n_id += 0 if probs else 1
                if it.get("hc"):
                    if not it.get("src"):
                        errors.append(f"{label}: built-in item needs 'src' (source section)")
                    n_hc += 1
                elif it.get("cmd"):
                    used.update(it["cmd"] if isinstance(it["cmd"], list) else [it["cmd"]])
                    probs = check_ref(it, ref)
                    errors.extend(f"{label}: {p}" for p in probs)
                    n_ok += 0 if probs else 1
                else:
                    todo.append(label)

    for s_ in data.get("start", []):
        for k in s_["keys"]:
            for ch in k.split(" "):
                try:
                    rk.normalize_data_chord(ch)
                except rk.KeymapError as ex:
                    errors.append(f"start '{s_['step']['en']}': {ex}")

    mac_ok = not errors and not todo
    if args.write:
        meta["macVerified"] = mac_ok
        if mac_ok:
            meta["verified"] = datetime.date.today().isoformat()
        write_data(data)
        print("data.js written")
    elif meta.get("macVerified") != mac_ok:
        errors.append(f"meta.macVerified is {meta.get('macVerified')} but should be {mac_ok} (run with --write)")

    total = n_ok + n_hc + len(todo)
    unused = [n for n, r in ref.items() if n not in used and r["win"]]
    nokey = [n for n, r in ref.items() if not r["win"]]
    print(f"\n{total} shortcuts: {n_ok} verified against the reference (Windows/Linux and macOS keys), "
          f"{n_hc} built-in behaviours (hc, from the article text), {len(todo)} to check")
    if exports:
        print(f"{n_id} command ids checked against the keyboard preset export(s)")
    if unused:
        print(f"reference actions with keys not used in data.js: {', '.join(unused)}")
    if nokey:
        print(f"reference actions without a key (not listed as shortcuts): {', '.join(nokey)}")
    for w in warnings:
        print(f"  ! {w}")
    if todo:
        print("\nTo check (do sprawdzenia):")
        for t in todo:
            print(f"  ? {t}")
    if errors:
        print(f"\n{len(errors)} problem(s):")
        for e in errors:
            print(f"  ✗ {e}")
    if errors or todo:
        sys.exit(1)
    print("All checks passed ✓")


if __name__ == "__main__":
    main()
