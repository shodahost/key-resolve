"""
Parser for DaVinci Resolve keyboard preset exports.

Resolve writes a preset (Keyboard Customization -> ... -> Export Preset) as a
plain text file. Format observed in real exports:

    import "DaVinci Resolve"                    <- optional: preset it is based on
    controlPlayReverse := J                     <- command id := key
    editNudgeTrimStepTrimMultiFrameRight := Shift+. | Ctrl+Shift+Right
    editBlade :=                                <- command with no key
    EditTimeline.Context_renderInPlace := Ctrl+R
    FusionWidget.fuHotkey_GLViewer_Viewer_Guides_Show := Shift+G
    sessionPrinterLightsYelQuarterPlus := Ctrl+Num+3

* One command per line, "id := binding | binding | ...".
* Command ids are internal names; a "Context." prefix scopes the key to one
  panel (timeline, viewer, media pool, Fusion...).
* Key names follow Qt: modifiers Ctrl / Alt / Shift / Meta, "Num+" marks a
  keypad key. Resolve exports use the same text on every platform: on macOS
  "Ctrl" is ⌘ Command, "Alt" is ⌥ Option and "Meta" is the ⌃ Control key.

Keys are normalised to the token syntax used in assets/data.js
("Ctrl+Shift+Period", "Num3", "LBracket", ...), so the two can be compared.

Only the Python standard library is used.
"""

import re

MOD_ORDER = ("Ctrl", "Alt", "Shift", "Meta")
MOD_ALIASES = {
    "ctrl": "Ctrl", "control": "Ctrl", "cmd": "Ctrl", "command": "Ctrl", "⌘": "Ctrl",
    "alt": "Alt", "opt": "Alt", "option": "Alt", "⌥": "Alt",
    "shift": "Shift", "⇧": "Shift",
    "meta": "Meta", "⌃": "Meta",
}
# Export key text -> data.js token.
KEY_NAMES = {
    ".": "Period", ",": "Comma", "/": "Slash", "\\": "Backslash", "[": "LBracket", "]": "RBracket",
    "-": "Minus", "=": "Equal", "`": "Grave", "'": "Quote", ";": "Semicolon",
    "space": "Space", "tab": "Tab", "backtab": "Tab", "return": "Enter", "enter": "Enter",
    "esc": "Esc", "escape": "Esc", "del": "Del", "delete": "Del", "backspace": "Backspace",
    "ins": "Ins", "insert": "Ins", "home": "Home", "end": "End",
    "pgup": "PgUp", "pageup": "PgUp", "pgdown": "PgDn", "pgdn": "PgDn", "pagedown": "PgDn",
    "up": "Up", "down": "Down", "left": "Left", "right": "Right",
}
# Shifted symbols some layouts export literally.
SYMBOLS = {"?": "Question", "~": "Tilde", "!": "Exclam", "@": "At", "#": "Hash", "$": "Dollar",
           "%": "Percent", "^": "Caret", "&": "Ampersand", "*": "Asterisk", "(": "LParen",
           ")": "RParen", "_": "Underscore", "+": "Plus", "{": "LBrace", "}": "RBrace",
           "|": "Bar", ":": "Colon", '"': "DoubleQuote", "<": "Less", ">": "Greater"}
KEY_NAMES.update(SYMBOLS)
NUMPAD = {".": "NumDot", "+": "NumPlus", "-": "NumMinus", "/": "NumSlash", "*": "NumStar",
          "enter": "NumEnter", "return": "NumEnter", "=": "NumEqual"}
# Tokens accepted in data.js besides letters, digits, F-keys and NumN.
DATA_TOKENS = set(KEY_NAMES.values()) | set(NUMPAD.values()) | {
    "LMB", "RMB", "MMB", "Wheel", "0-9"}

LINE_RE = re.compile(r"^(?P<cmd>[^\s:]+)\s*:=\s*(?P<keys>.*)$")
IMPORT_RE = re.compile(r'^import\s+"(?P<name>[^"]+)"\s*$')


class KeymapError(ValueError):
    pass


def split_chord(text):
    """'Ctrl+Shift+.' -> ['Ctrl', 'Shift', '.'];  'Ctrl++' -> ['Ctrl', '+']."""
    text = text.strip()
    if text == "+":
        return ["+"]
    if text.endswith("++"):
        return [p for p in text[:-2].split("+") if p] + ["+"]
    parts = text.split("+")
    if any(p == "" for p in parts):
        raise KeymapError(f"cannot split key {text!r}")
    return parts


def normalize_export_chord(text):
    """Key text from an export -> canonical data.js chord ('Ctrl+Shift+Z')."""
    parts = split_chord(text)
    mods, numpad = set(), False
    for p in parts[:-1]:
        low = p.lower()
        if low in ("num", "keypad"):
            numpad = True
        elif low in MOD_ALIASES:
            mods.add(MOD_ALIASES[low])
        else:
            raise KeymapError(f"unknown modifier {p!r} in {text!r}")
    main = parts[-1]
    low = main.lower()
    if numpad:
        if main.isdigit() and len(main) == 1:
            token = "Num" + main
        elif low in NUMPAD:
            token = NUMPAD[low]
        else:
            raise KeymapError(f"unknown keypad key {main!r} in {text!r}")
    elif len(main) == 1 and main.isalpha():
        token = main.upper()
    elif len(main) == 1 and main.isdigit():
        token = main
    elif re.fullmatch(r"[Ff]([1-9]|1[0-9]|2[0-4])", main):
        token = main.upper()
    elif low in KEY_NAMES:
        token = KEY_NAMES[low]
    elif main in KEY_NAMES:
        token = KEY_NAMES[main]
    else:
        raise KeymapError(f"unknown key {main!r} in {text!r}")
    return canonical(mods, token)


def canonical(mods, token):
    return "+".join([m for m in MOD_ORDER if m in mods] + [token])


def normalize_data_chord(chord):
    """data.js chord ('Shift+Ctrl+Z', 'Ctrl+Num3') -> canonical form."""
    parts = chord.split("+")
    mods = set()
    for p in parts[:-1]:
        if p not in MOD_ORDER:
            raise KeymapError(f"unknown modifier {p!r} in {chord!r}")
        mods.add(p)
    token = parts[-1]
    base = re.sub(r"-Drag$", "", re.sub(r"^2x", "", token))
    ok = (re.fullmatch(r"[A-Z0-9]", base) or re.fullmatch(r"F([1-9]|1[0-9]|2[0-4])", base)
          or re.fullmatch(r"Num[0-9]", base) or base in DATA_TOKENS or base in MOD_ORDER)
    if not ok:
        raise KeymapError(f"unknown key token {token!r} in {chord!r}")
    return canonical(mods, token)


def parse_export(path_or_text, is_text=False):
    """Parse an export. Returns {'imports': [...], 'bindings': {cmd: [chords]}, 'unbound': set}."""
    if is_text:
        text = path_or_text
    else:
        with open(path_or_text, encoding="utf-8-sig") as f:
            text = f.read()
    imports, bindings, unbound = [], {}, set()
    for n, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#") or line.startswith("//"):
            continue
        m = IMPORT_RE.match(line)
        if m:
            imports.append(m.group("name"))
            continue
        m = LINE_RE.match(line)
        if not m:
            raise KeymapError(f"line {n}: unrecognised line {raw!r}")
        cmd, keys = m.group("cmd"), m.group("keys").strip()
        if cmd in bindings or cmd in unbound:
            raise KeymapError(f"line {n}: command {cmd!r} listed twice")
        if not keys:
            unbound.add(cmd)
            continue
        chords = []
        for alt in re.split(r"\s\|\s", keys):
            try:
                chords.append(normalize_export_chord(alt))
            except KeymapError as ex:
                raise KeymapError(f"line {n}: {ex}") from None
        bindings[cmd] = chords
    return {"imports": imports, "bindings": bindings, "unbound": unbound}


def reverse_index(bindings):
    """canonical chord -> [command ids]"""
    idx = {}
    for cmd, chords in bindings.items():
        for ch in chords:
            idx.setdefault(ch, []).append(cmd)
    return idx
