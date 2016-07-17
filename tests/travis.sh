#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# install antwar so that the cli can find it
npm i -g

# clear and re-create the test directory
rm -rf test || exit 0
mkdir test

cd test

# clone cli and set it up
git clone https://github.com/antwarjs/cli.git cli
cd cli
npm i -g

# remove installed version given we want to rely on the linked one
rm -rf node_modules/antwar

cd ..

# initialize project and build it
antwar -i demo
cd demo
antwar -b
