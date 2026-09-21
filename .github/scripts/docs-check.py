#!/usr/bin/env python3
"""Docs check: frontmatter parses and relative links resolve (both fail).
Unresolved [[wikilinks]] are reported only: Obsidian treats a link to a
not-yet-written page as legal, and the vault uses them that way.

Usage: docs-check.py ROOT [FILE...]   (no FILEs = every .md under ROOT)
Exit 0 clean, 1 findings, 2 could not run (no files checked).
"""
import os, re, sys
import yaml

root = os.path.abspath(sys.argv[1])
files = sys.argv[2:]
if not files:
    files = []
    for d, dirs, fs in os.walk(root):
        dirs[:] = [x for x in dirs if not x.startswith(".") and x != "node_modules"]
        files += [os.path.relpath(os.path.join(d, f), root) for f in fs if f.endswith(".md")]
files = [f for f in files if f.endswith(".md") and os.path.isfile(os.path.join(root, f))]
if not files:
    print("UNKNOWN: 0 markdown files to check"); sys.exit(2)

stems = set()
for d, dirs, fs in os.walk(root):
    dirs[:] = [x for x in dirs if not x.startswith(".")]
    for f in fs:
        stems.add(os.path.splitext(f)[0].lower())
        stems.add(os.path.relpath(os.path.join(d, os.path.splitext(f)[0]), root).lower())

CODE = re.compile(r"```.*?```|`[^`\n]*`", re.S)
MDLINK = re.compile(r"\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
WIKI = re.compile(r"\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]")
bad = {"frontmatter": 0, "link": 0}
notes = 0
for rel in sorted(files):
    text = open(os.path.join(root, rel), encoding="utf-8", errors="replace").read()
    # Obsidian templates carry Templater tags ({{date:...}}) that are not YAML
    # until rendered, so their frontmatter is not held to the parser.
    if text.startswith("---\n") and not rel.startswith("templates/"):
        end = text.find("\n---", 4)
        try:
            if end < 0: raise ValueError("no closing ---")
            yaml.safe_load(text[4:end])
        except Exception as e:
            bad["frontmatter"] += 1
            print(f"{rel}: frontmatter: {str(e).splitlines()[0]}")
    body = CODE.sub("", text)
    for m in MDLINK.finditer(body):
        t = m.group(1).split("#")[0]
        if not t or re.match(r"^[a-z][a-z0-9+.-]*:", t, re.I) or t.startswith("/"):
            continue
        p = os.path.normpath(os.path.join(root, os.path.dirname(rel), t.replace("%20", " ")))
        if not os.path.exists(p):
            bad["link"] += 1; print(f"{rel}: link: {m.group(1)}")
    for m in WIKI.finditer(body):
        t = m.group(1).strip().rstrip("\\").strip().lower()
        t = t[:-3] if t.endswith(".md") else t
        if t not in stems and os.path.basename(t) not in stems:
            notes += 1; print(f"{rel}: note: unresolved wikilink [[{m.group(1)}]]")
print(f"checked {len(files)} files: " + ", ".join(f"{k}={v}" for k, v in bad.items()) + f", unresolved-wikilinks={notes} (not failing)")
sys.exit(1 if any(bad.values()) else 0)
