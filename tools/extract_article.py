#!/usr/bin/env python3
"""
Extract the shortcut table from a saved copy of the DaVinci Resolve Club article
"DaVinci Resolve keyboard shortcuts" (Resolve 21.1, updated 2026-09-27) into
reference/resolve-21.1-article-table.tsv.

The article's table has the columns Action | Windows | macOS | What it does;
each Action cell also carries the article's category in a <span>. Keys are
kept exactly as printed ("Ctrl + \\", "Option + Y", "Verify active preset").

Usage:
  python3 tools/extract_article.py path/to/article.html

Only the Python standard library is used.
"""

import html.parser
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "reference", "resolve-21.1-article-table.tsv")
HEADER = ["action", "category", "windows", "macos", "what_it_does"]


class TableParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell, self.span = [], None, None, None
        self.in_tbody = False

    def handle_starttag(self, tag, attrs):
        if tag == "tbody":
            self.in_tbody = True
        elif tag == "tr" and self.in_tbody:
            self.row = []
        elif tag == "td" and self.row is not None:
            self.cell, self.span = [], None
        elif tag == "span" and self.cell is not None:
            self.span = []

    def handle_endtag(self, tag):
        if tag == "tbody":
            self.in_tbody = False
        elif tag == "span" and self.span is not None:
            self.row.append(("span", "".join(self.span).strip()))
            self.span = None
        elif tag == "td" and self.cell is not None:
            self.row.append(("td", " ".join("".join(self.cell).split())))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.span is not None:
            self.span.append(data)
        elif self.cell is not None:
            self.cell.append(data)


def extract(path):
    p = TableParser()
    with open(path, encoding="utf-8") as f:
        p.feed(f.read())
    out = []
    for row in p.rows:
        cells = [v for kind, v in row if kind == "td"]
        spans = [v for kind, v in row if kind == "span"]
        if len(cells) != 4 or len(spans) != 1:
            raise SystemExit(f"unexpected table row: {row!r}")
        action, win, mac, what = cells
        out.append([action, spans[0], win, mac, what])
    if not out:
        raise SystemExit("no table rows found")
    return out


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    rows = extract(sys.argv[1])
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\t".join(HEADER) + "\n")
        for r in rows:
            if any("\t" in c or "\n" in c for c in r):
                raise SystemExit(f"tab or newline in cell: {r!r}")
            f.write("\t".join(r) + "\n")
    print(f"{len(rows)} rows written to {os.path.relpath(OUT, ROOT)}")


if __name__ == "__main__":
    main()
