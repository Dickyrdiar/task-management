#!/bin/bash
echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

echo "Installing dependencies..."
bun install

echo "Running build..."
bun run build