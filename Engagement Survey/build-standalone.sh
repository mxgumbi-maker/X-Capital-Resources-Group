#!/bin/sh
# Builds index.html, a standalone copy of survey-app.html for GitHub Pages.
# survey-app.html is the claude.ai Artifact source, which gets its document
# skeleton at publish time; this adds the same skeleton for a static host.
cd "$(dirname "$0")"
{
  printf '%s\n' '<!doctype html>' '<html lang="en-ZA">' '<head>' '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' \
    '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>' \
    '</head>' '<body>'
  cat survey-app.html
  printf '%s\n' '</body>' '</html>'
} > index.html
