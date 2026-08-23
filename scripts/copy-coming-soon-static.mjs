import { copyFile, cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const publicDir = resolve(root, 'public');

await mkdir(resolve(dist, 'coming-soon'), { recursive: true });
await cp(resolve(publicDir, 'coming-soon'), resolve(dist, 'coming-soon'), { recursive: true, force: true });
await copyFile(resolve(publicDir, 'wrnc-logo.png'), resolve(dist, 'wrnc-logo.png'));
await copyFile(resolve(publicDir, 'wrnc-social.png'), resolve(dist, 'wrnc-social.png'));

console.log('Copied controlled /coming-soon static assets into dist.');
