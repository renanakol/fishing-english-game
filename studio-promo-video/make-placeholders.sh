#!/usr/bin/env bash
# Generates colored placeholder images so the video renders before real works are added.
set -e
cd "$(dirname "$0")/public/works"
colors=("0xE4572E" "0x2E86AB" "0xF6AE2D" "0x33658A" "0x86BBD8" "0x758E4F")
n=0
for dir in branding web illustration video; do
  for i in 1 2 3 4; do
    f="$dir/$i.jpg"
    [ -f "$f" ] && continue
    c=${colors[$((n % ${#colors[@]}))]}; n=$((n+1))
    size=1200x1200; [ "$dir" = web ] && size=1440x2400
    ffmpeg -loglevel error -f lavfi -i "gradients=s=$size:c0=$c:c1=0xF6F1EA:x0=0:y0=0:x1=1200:y1=1200:d=1" -frames:v 1 "$f"
  done
done
