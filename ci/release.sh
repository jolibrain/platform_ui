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
echo v$tag > public/version

sed -ne "/^## \[$tag\]/,/^##.*202/p" CHANGELOG.md \
    | sed -e '$d' -e '1d' > note.md

cat >> note.md <<EOF
### Docker images:

* Platform UI: \`docker pull docker.jolibrain.com/platform_ui:$tag\`
* All images available on https://docker.jolibrain.com/
EOF

trap "rm -f note.md" EXIT
gh release create --title "DeepDetect Platform UI v$tag" -F note.md --latest v$tag
git push --follow-tags origin master
