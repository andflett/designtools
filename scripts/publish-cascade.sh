#!/usr/bin/env bash
set -e

BUMP="${1:-patch}"
PUBLISH_REPO="/Users/andrew/Sites/cascade"

if [ ! -d "$PUBLISH_REPO" ]; then
  echo "Error: publish repo not found at $PUBLISH_REPO"
  exit 1
fi

echo "Generating icons..."
npx tsx packages/cascade/scripts/generate.ts

echo "Copying to publish repo..."
npx tsx packages/cascade/scripts/copy-to-publish.ts

echo "Building ($PUBLISH_REPO)..."
cd "$PUBLISH_REPO"
npm run build

echo "Bumping version ($BUMP)..."
npm version "$BUMP" --no-git-tag-version

echo "Publishing @designtools/cascade..."
npm publish --access public

echo "Done — published @designtools/cascade@$(node -p "require('./package.json').version")"
