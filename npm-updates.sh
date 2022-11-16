#!/bin/bash
#
# Update node/npm dependencies
#
# - Use "node-check-updates" (or ncu) to see which dependencies are out of date. It will show you the latest version (x.y.z).
# - If z is out of date, just "npm install [lib] will install the update.
# - For y out of date, "npm install [lib]@latest" will install the update.
#
# For example:
#
# scripts/run_batch.sh
#

# Terry upgraded these:

npm install @dra2020/baseclient 
npm install @types/geojson      
npm install prettier@latest
npm install source-map-loader@4
npm install ts-loader@latest
npm install tsify 
npm install typescript@latest
npm install webpack@latest
npm install webpack-cli@latest

# Terry left these as is:
#  @types/jest     ^25.2.3  →   ^29.2.3     
#  @types/node   ^12.20.55  →  ^18.11.9     
#  @types/yargs   ^12.0.12  →  ^17.0.13     
#  csv-parse       ^4.16.3  →    ^5.3.2     
#  jest            ^25.5.3  →   ^29.3.1     
#  ts-jest         ^26.5.6  →   ^29.0.3     
#  yargs           ^12.0.5  →   ^17.6.2

# @types/jest, jest and ts-jest should all match at the major version level.

# I tweaked these files, to get the project to build again:
#
# _cli.ts
# fileutils.ts
# jest.config.js

# I bumped the version number to 3.1.0.

# At this point, the project builds, but the tests don't run.
# if (error?.stack) {
