#!/usr/bin/env bash
set -euo pipefail

DIR="content/posts"

# Safety check
if [[ ! -d "$DIR" ]]; then
  echo "Directory not found: $DIR" >&2
  exit 1
fi

# Rename only regular files in that folder (non-recursive)
find "$DIR" -maxdepth 1 -type f -print0 |
while IFS= read -r -d '' src; do
  base="$(basename "$src")"
  lower="$(printf '%s' "$base" | tr '[:upper:]' '[:lower:]')"

  # Skip if already lowercase
  [[ "$base" == "$lower" ]] && continue

  dst="$DIR/$lower"

  # If destination exists:
  if [[ -e "$dst" ]]; then
    # On case-insensitive filesystems, src and dst can be the same file.
    if [[ "$src" -ef "$dst" ]]; then
      tmp="$DIR/.rename_tmp_$$.$RANDOM.$lower"
      mv -- "$src" "$tmp"
      mv -- "$tmp" "$dst"
      echo "Renamed (case-only): $base -> $lower"
      continue
    fi

    # Otherwise it's a real conflict (two different files collapse to same lowercase name)
    echo "ERROR: would overwrite existing file:" >&2
    echo "  from: $src" >&2
    echo "  to:   $dst" >&2
    echo "Resolve the conflict (duplicate names after lowercasing) and rerun." >&2
    exit 2
  fi

  mv -- "$src" "$dst"
  echo "Renamed: $base -> $lower"
done
