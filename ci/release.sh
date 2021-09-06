#!/bin/bash

set -e

here=$(readlink -f $(dirname $0))
kind=${1:-patch}

cd $here/..

if [ -f "CHANGELOG.md" ]; then
  git rm CHANGELOG.md
fi
yarn run standard-version -r $kind
tag=$(cat package.json | jq -r .version)

sed -ne "/^## \[$tag\]/,/^##.*202/p" CHANGELOG.md | sed -e '$d' -e '1d' > note.md

cat >> note.md <<EOF
### Docker images:

* Platform UI: \`docker pull jolibrain/deepdetect_ui:$tag\`
* All images available on https://hub.docker.com/u/jolibrain
EOF

trap "rm -f note.md" EXIT
gh release create --title "DeepDetect Platform UI v$tag" -F note.md -d v$tag
