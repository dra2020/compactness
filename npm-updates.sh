#!/bin/bash
#
# Update node/npm dependencies
#
# - Use "node-check-updates" (or ncu) to see which dependencies are out of date. 
#   It will show you the latest version (x.y.z).
#
# - If z is out of date, just "npm install [lib] will install the update.
# - If y is out of date, "npm install [lib]@latest" will install the update.
# - If x is out of date, "npm install [lib]@<new x>"" will install the update.
#
# For example:
#
# ./npm-updates.sh
#

# Terry upgraded these:

# npm install @dra2020/baseclient 
# npm install @types/geojson      
# npm install prettier@latest
# npm install source-map-loader@4
# npm install ts-loader@latest
# npm install tsify 
# npm install typescript@latest
# npm install webpack@latest
# npm install webpack-cli@latest

# Terry left these as is:
#  @types/jest     ^25.2.3  →   ^29.2.3     
#  @types/node   ^12.20.55  →  ^18.11.9     
#  @types/yargs   ^12.0.12  →  ^17.0.13     
#  csv-parse       ^4.16.3  →    ^5.3.2     
#  jest            ^25.5.3  →   ^29.3.1     
#  ts-jest         ^26.5.6  →   ^29.0.3     
#  yargs           ^12.0.5  →   ^17.6.2

# I tweaked these files, to get the project to build again:
#
# _cli.ts
# fileutils.ts
# jest.config.js

# I bumped the version number to 3.1.0.

# At this point, the project builds, but the tests don't run.
# if (error?.stack) {

# @types/jest, jest and ts-jest should all match at the major version level, but:
# @types/jest     ^25.2.3  →   ^29.2.3       
# jest            ^25.5.3  →   ^29.3.1     
# ts-jest         ^26.5.6  →   ^29.0.3

# I ran this:
# npm install @types/jest@26
# npm install jest@26
# npn install ts-jest@26

# which yielded this:
#  @types/jest    ^26.0.24  →   ^29.2.3     
#  jest            ^26.6.3  →   ^29.3.1     
#  ts-jest         ^26.5.6  →   ^29.0.3 

# The project didn't build. I backed off the change to _cli.ts, and it builds again.
# 'jest' tests run now, but there are failures:
# Lots of "TypeError: csvArray is not iterable"

# I backed out the tweak to fileutils.ts, and the tests run again too. Also, still builds.

# Leaving dependency updates like this:
#  @types/jest    ^26.0.24  →   ^29.2.3     
#  @types/node   ^12.20.55  →  ^18.11.9     
#  @types/yargs   ^12.0.12  →  ^17.0.13     
#  csv-parse       ^4.16.3  →    ^5.3.2     
#  jest            ^26.6.3  →   ^29.3.1     
#  ts-jest         ^26.5.6  →   ^29.0.3     
#  yargs           ^12.0.5  →   ^17.6.2

# 