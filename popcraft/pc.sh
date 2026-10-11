#!/bin/sh
exec node "${POPCRAFT_CLI:-$HOME/Projects/vizpops/vizpops/packages/cli/dist/popcraft.mjs}" "$@"
