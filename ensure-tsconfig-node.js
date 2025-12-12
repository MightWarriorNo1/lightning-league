import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const tsconfigNodePath = join(process.cwd(), 'tsconfig.node.json');

if (!existsSync(tsconfigNodePath)) {
  const defaultConfig = {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2023'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ['vite.config.ts'],
  };
  
  writeFileSync(tsconfigNodePath, JSON.stringify(defaultConfig, null, 2));
  console.log('Created tsconfig.node.json');
}
