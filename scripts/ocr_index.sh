#!/bin/bash
# Renders every page of the given PDFs to PNG and OCRs them (eng+tha) into
# one text file per book, with page-number markers, so we can grep for
# restaurant/food-relevant content instead of paging through images by hand.
set -e
export PATH="/c/Users/dyn15/bin:/c/Program Files/Tesseract-OCR:$PATH"
export TESSDATA_PREFIX=/c/Users/dyn15/tessdata

SCRATCH="/c/Users/dyn15/AppData/Local/Temp/claude/C--Users-dyn15-Downloads-learn-thai/e62a1d00-22ff-42c3-99a8-9387aaaf4025/scratchpad"
OUT="/c/Users/dyn15/Downloads/learn thai/scripts/extracted"
mkdir -p "$OUT"

declare -A BOOKS=(
  ["fsi"]="/c/Users/dyn15/Downloads/Fsi-ThaiBasicCourse-Volume1-StudentText.pdf"
  ["essential"]="/c/Users/dyn15/Downloads/Essential-Thai-James-Higbie-70-MB-3.pdf"
  ["sawasdee"]="/c/Users/dyn15/Downloads/สวัสดี๑เล่ม๑แก้ไข.pdf"
)

for name in "${!BOOKS[@]}"; do
  pdf="${BOOKS[$name]}"
  pages=$(pdfinfo "$pdf" | awk '/^Pages:/{print $2}')
  echo "=== $name: $pages pages ==="
  workdir="$SCRATCH/ocr_$name"
  mkdir -p "$workdir"
  outfile="$OUT/$name.index.txt"
  : > "$outfile"
  for ((start=1; start<=pages; start+=25)); do
    end=$((start+24))
    if [ "$end" -gt "$pages" ]; then end=$pages; fi
    pdftoppm -png -r 120 -f "$start" -l "$end" "$pdf" "$workdir/p"
    for f in "$workdir"/p-*.png; do
      pgnum=$(echo "$f" | grep -oE '[0-9]+' | tail -1)
      tesseract "$f" stdout -l eng+tha --psm 6 2>/dev/null >> /tmp/page_ocr.txt || true
      echo "--- PAGE $pgnum ($name) ---" >> "$outfile"
      cat /tmp/page_ocr.txt >> "$outfile"
      rm -f /tmp/page_ocr.txt "$f"
    done
    echo "  done pages $start-$end"
  done
  echo "=== $name complete: $outfile ==="
done
echo "ALL DONE"
