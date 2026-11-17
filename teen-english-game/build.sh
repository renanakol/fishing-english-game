#!/bin/sh
# Builds snack-squad.html (standalone, opens directly on a phone) from index.html (artifact source).
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  sed -n '1,/^<\/style>/p' index.html; printf '</head>\n<body>\n'
  sed -n '/^<\/style>/,$p' index.html | tail -n +2; printf '</body>\n</html>\n'; } > snack-squad.html
