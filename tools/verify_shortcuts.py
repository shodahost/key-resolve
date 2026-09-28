#!/usr/bin/env python3
"""
Verify assets/data.js against DaVinci Resolve's own default keyboard preset.

Resolve is closed source, so the source of truth is an export of the default
"DaVinci Resolve" keyboard preset, stored in reference/:

    DaVinci Resolve -> Keyboard Customization (Ctrl+Alt+K / Cmd+Opt+K)
      -> preset menu (…) -> Export Preset…  ->  reference/<name>.txt

The file names are listed in meta.keymaps in data.js ("win" and optionally
"mac"). tools/resolve_keymap.py documents the export format.

Every shortcut in data.js is one of:

  * "cmd"  - the Resolve command id(s) from the export. The script checks that
             the keys in "k" (and "mk" for macOS, if a macOS export exists)
             really are bound to that command.
  * "hc"   - built-in behaviour that is not in the keyboard preset (mouse
             modifiers, typing a timecode...). Needs "src", the Reference
             Manual chapter it comes from. Only the key tokens are checked.
  * "mq"   - (optional, together with "src") a short quote from the Reference
             Manual that shows the keys. Checked when --manual is given.

Anything that is neither verified by the export nor marked "hc" is reported
as "to check" and makes the script fail.

Usage:
  python3 tools/verify_shortcuts.py                  # verify, exit != 0 on problems
  python3 tools/verify_shortcuts.py --write          # also rewrite data.js in the stable format
  python3 tools/verify_shortcuts.py --fill-cmd       # fill missing "cmd" from the export (unique matches)
  python3 tools/verify_shortcuts.py --manual man.txt # check "mq" quotes (text from pdftotext)
  python3 tools/verify_shortcuts.py --find "Ctrl+B"  # which commands use a key
  python3 tools/verify_shortcuts.py --dump km.txt    # write the parsed export

Only the Python standard library is used. It is meant to run locally
(there is deliberately no CI).
"""

import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import resolve_keymap as rk  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(ROOT, "assets", "data.js")
DATA_PREFIX = "window.KB_DATA = "
ITEM_KEYS = ("k", "mk", "en", "pl", "l", "h", "st", "cmd", "hc", "src", "mq")


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


def mac_default(chord):
    """The macOS chord when no "mk" is given: exports use the same text on both platforms."""
    return chord


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


def manual_text(path):
    """Text of the Reference Manual (a .txt from pdftotext, or a .pdf if pdftotext is installed)."""
    if path.lower().endswith(".pdf"):
        exe = shutil.which("pdftotext")
        if not exe:
            sys.exit("--manual: pdftotext is not installed; convert the PDF to text first")
        out = subprocess.run([exe, "-layout", path, "-"], capture_output=True, check=True)
        text = out.stdout.decode("utf-8", "replace")
    else:
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
    return norm_text(text)


def norm_text(s):
    s = s.replace("‑", "-").replace("‐", "-").replace("­", "")
    s = s.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    s = re.sub(r"-\s*\n\s*", "-", s)  # line-broken "Command-\nB"
    return re.sub(r"\s+", " ", s).lower()


def check_tokens(it):
    for field in ("k", "mk"):
        if field in it:
            for alt in alts(it[field]):
                for ch in chords(alt):
                    rk.normalize_data_chord(ch)


def check_cmd(it, km, field, platform):
    """Return a list of problems for one platform."""
    problems = []
    cmds = it["cmd"] if isinstance(it["cmd"], list) else None
    keys = alts(it[field])
    if cmds and len(cmds) != len(keys):
        return [f"{len(keys)} key alternatives but {len(cmds)} commands"]
    for i, alt in enumerate(keys):
        cmd = cmds[i] if cmds else it["cmd"]
        seq = chords(alt)
        if len(seq) != 1:
            problems.append(f"'{alt}': key sequences cannot be checked against the export")
            continue
        want = rk.normalize_data_chord(seq[0])
        if field == "k" and platform == "mac":
            want = mac_default(want)
        if cmd not in km["bindings"]:
            why = "has no key" if cmd in km["unbound"] else "is not in the export"
            problems.append(f"[{platform}] command {cmd} {why}")
        elif want not in km["bindings"][cmd]:
            problems.append(f"[{platform}] '{alt}' is not bound to {cmd} (bound: {' | '.join(km['bindings'][cmd])})")
    return problems


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write", action="store_true", help="rewrite data.js in the stable format and update meta")
    ap.add_argument("--fill-cmd", action="store_true", help="fill missing cmd from the export when the keys match one command")
    ap.add_argument("--manual", metavar="FILE", help="Reference Manual as text (or PDF with pdftotext installed) to check 'mq' quotes")
    ap.add_argument("--find", metavar="KEYS", help="list commands bound to KEYS (data.js syntax, e.g. Ctrl+Shift+Period)")
    ap.add_argument("--dump", metavar="FILE", help="write the parsed export(s) to FILE")
    args = ap.parse_args()

    data = read_data()
    meta = data["meta"]
    paths = meta.get("keymaps", {})
    errors, warnings = [], []
    exports = {}
    for platform in ("win", "mac"):
        if paths.get(platform):
            try:
                km = load_export(paths[platform])
            except rk.KeymapError as ex:
                errors.append(str(ex))
                km = None
            if km is None and not any(paths[platform] in e for e in errors):
                warnings.append(f"{platform} export {paths[platform]} not found")
            if km:
                exports[platform] = km
                print(f"{platform}: {paths[platform]} — {len(km['bindings'])} bound commands, "
                      f"{len(km['unbound'])} without keys" + (f", based on {km['imports']}" if km["imports"] else ""))
    win, mac = exports.get("win"), exports.get("mac")

    if args.find:
        want = rk.normalize_data_chord(args.find)
        for platform, km in exports.items():
            print(f"{platform}: {want} -> {', '.join(rk.reverse_index(km['bindings']).get(want, [])) or '(nothing)'}")
        return
    if args.dump:
        with open(args.dump, "w", encoding="utf-8") as f:
            for platform, km in exports.items():
                f.write(f"=== {platform}\n")
                for cmd in sorted(km["bindings"]):
                    f.write(f"{cmd} := {' | '.join(km['bindings'][cmd])}\n")
        print(f"export written to {args.dump}")

    manual = manual_text(args.manual) if args.manual else None
    rev = rk.reverse_index(win["bindings"]) if win else {}

    n_cmd = n_mac = n_hc = n_mq = filled = 0
    todo = []
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
                if it.get("cmd") and it.get("hc"):
                    errors.append(f"{label}: an item is either 'cmd' or 'hc', not both")

                if args.fill_cmd and win and not it.get("cmd") and not it.get("hc"):
                    found = []
                    for alt in alts(it["k"]):
                        seq = chords(alt)
                        hits = rev.get(rk.normalize_data_chord(seq[0]), []) if len(seq) == 1 else []
                        found.append(hits[0] if len(hits) == 1 else None)
                    if all(found):
                        it["cmd"] = found[0] if len(set(found)) == 1 else found
                        filled += 1

                if it.get("mq") and manual is not None and norm_text(it["mq"]) not in manual:
                    errors.append(f"{label}: manual quote not found: {it['mq']!r}")
                elif it.get("mq") and manual is not None:
                    n_mq += 1
                if it.get("mq") and not it.get("src"):
                    errors.append(f"{label}: 'mq' needs 'src' (manual chapter)")

                if it.get("hc"):
                    if not it.get("src"):
                        errors.append(f"{label}: built-in item needs 'src' (Reference Manual chapter)")
                    n_hc += 1
                elif it.get("cmd"):
                    if not win:
                        todo.append(f"{label} (cmd {it['cmd']}: no Windows/Linux export to check against)")
                        continue
                    probs = check_cmd(it, win, "k", "win")
                    if mac:
                        probs += check_cmd(it, mac, "mk" if it.get("mk") else "k", "mac")
                    if probs:
                        errors.extend(f"{label}: {p}" for p in probs)
                    else:
                        n_cmd += 1
                        n_mac += 1 if mac else 0
                else:
                    todo.append(label)

    mac_ok = bool(mac) and n_mac == n_cmd and not errors
    if meta.get("macVerified", False) != mac_ok:
        if args.write:
            meta["macVerified"] = mac_ok
        else:
            errors.append(f"meta.macVerified is {meta.get('macVerified')} but should be {mac_ok} (run with --write)")
    if args.write or args.fill_cmd:
        if not errors and not todo:
            meta["verified"] = datetime.date.today().isoformat()
        write_data(data)
        print("data.js written" + (f" ({filled} commands filled in)" if args.fill_cmd else ""))

    total = n_cmd + n_hc + len(todo)
    print(f"\n{total} shortcuts: {n_cmd} verified against the Resolve {meta['resolve']} keyboard preset"
          f"{f' ({n_mac} also on macOS)' if mac else ' (no macOS export: macOS keys not verified)'}, "
          f"{n_hc} built-in behaviours (hc, not in the preset), {len(todo)} to check")
    if manual is not None:
        print(f"{n_mq} manual quotes found in the Reference Manual")
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
