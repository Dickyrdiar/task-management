import { execSync } from 'child_process';

// Generate Prisma client
execSync('bun run prisma generate', { stdio: 'inherit' });

// Build Netlify functions
execSync('bun x esbuild netlify/functions/index.ts --bundle --platform=node --outdir=netlify/functions/dist', { stdio: 'inherit' });