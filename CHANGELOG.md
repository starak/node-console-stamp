# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-02-16

### Breaking Changes

- **Node.js 18+ required** - Dropped support for Node.js < 18
- **ESM-first architecture** - Source code is now ESM; CommonJS is provided via bundled output
- **chalk 5.x** - Upgraded from chalk 4.x to 5.x (ESM-only)
- **chalk-template required** - Tagged template syntax for colors now requires `chalk-template` package

### Added

- **TypeScript support** - Full TypeScript rewrite with included type declarations
- **Dual module output** - Both ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`) builds
- **Vite build system** - Modern build tooling with Vite in library mode
- **Vitest test framework** - Migrated from Jest to Vitest for faster testing

### Changed

- Custom tokens with chalk colors must now use `chalk-template` syntax:
  ```javascript
  // v3 (no longer works)
  import chalk from 'chalk';
  tokens: { myToken: () => chalk.red('text') }

  // v4 (correct)
  import chalkTemplate from 'chalk-template';
  tokens: { myToken: () => chalkTemplate`{red text}` }
  ```

### Migration from v3

1. Update Node.js to version 18 or higher
2. Update import syntax from CommonJS to ESM:
   ```javascript
   // Before (CommonJS)
   const consoleStamp = require('console-stamp');

   // After (ESM)
   import consoleStamp from 'console-stamp';
   ```
3. If using custom tokens with chalk colors, switch to `chalk-template`:
   ```javascript
   import chalkTemplate from 'chalk-template';
   
   consoleStamp(console, {
       tokens: {
           myToken: () => chalkTemplate`{blue.bold custom}`
       }
   });
   ```

## [3.x] - Previous Versions

See [GitHub releases](https://github.com/starak/node-console-stamp/releases) for previous version history.
