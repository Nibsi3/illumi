import { cp, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const root = process.cwd();

  const nextDir = path.join(root, '.next');
  const standaloneDir = path.join(nextDir, 'standalone');

  const staticSrc = path.join(nextDir, 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');

  const publicSrc = path.join(root, 'public');
  const publicDest = path.join(standaloneDir, 'public');

  if (!(await exists(standaloneDir))) {
    throw new Error(
      `Expected Next.js standalone output at ${standaloneDir}. ` +
        `Ensure next.config.ts sets output: 'standalone' and the build succeeded.`,
    );
  }

  if (await exists(staticSrc)) {
    await mkdir(path.dirname(staticDest), { recursive: true });
    await cp(staticSrc, staticDest, { recursive: true, force: true });
  }

  if (await exists(publicSrc)) {
    await mkdir(publicDest, { recursive: true });
    await cp(publicSrc, publicDest, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
