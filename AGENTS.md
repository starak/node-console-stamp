# AGENTS.md - Coding Agent Guidelines for node-console-stamp

This document provides essential information for AI coding agents working on the
console-stamp npm package - a Node.js module that patches console methods to add
timestamps, log levels, and formatting.

## Project Overview

**Purpose**: Patch Node.js console methods to add timestamp/label prefixes
**Runtime**: Node.js >= 18
**Language**: TypeScript (strict mode)
**Module System**: ESM source, dual ESM + CommonJS output
**Build Tool**: Vite (library mode)
**Test Framework**: Vitest
**Dependencies**: chalk 5.x (ESM), chalk-template, dateformat 5.x

## Commands

### Building

```bash
# Build the library (outputs to dist/)
npm run build

# Build in watch mode
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx vitest run test/utils.test.ts

# Run a single test by name pattern
npx vitest run -t "generateConfig default"

# Run tests with coverage
npx vitest run --coverage
```

### Type Checking

```bash
# Run TypeScript type checker
npm run typecheck
```

## Project Structure

```
/
├── src/
│   ├── index.ts          # Main entry point - consoleStamp function
│   ├── types.ts          # TypeScript type definitions
│   ├── defaults.ts       # Default configuration options
│   ├── utils.ts          # Utility functions (config, prefix generation)
│   ├── dateformat.d.ts   # Type declarations for dateformat
│   └── tokens/
│       ├── index.ts      # Re-exports all tokens
│       ├── date.ts       # :date() token implementation
│       ├── label.ts      # :label() token implementation
│       └── msg.ts        # :msg token implementation
├── test/
│   ├── helpers/
│   │   └── SpyStream.ts  # Test helper for capturing output
│   ├── index.test.ts     # Main integration tests
│   ├── utils.test.ts     # Unit tests for utilities
│   └── tokens.test.ts    # Unit tests for tokens
├── dist/                 # Build output (git-ignored)
│   ├── index.js          # ESM build
│   ├── index.cjs         # CommonJS build
│   └── index.d.ts        # TypeScript declarations
├── examples/             # Usage examples (JavaScript)
├── vite.config.ts        # Vite build configuration
├── vitest.config.ts      # Vitest test configuration
└── tsconfig.json         # TypeScript configuration
```

## Code Style Guidelines

### Module System

- Use ESM imports/exports in source code
- Output supports both ESM and CommonJS consumers

```typescript
// Correct
import chalk from 'chalk';
export default consoleStamp;
export { consoleStamp };

// Incorrect (CommonJS)
const chalk = require('chalk');
module.exports = consoleStamp;
```

### Formatting

- Use 4-space indentation
- Use single quotes for strings
- Always include semicolons
- Use trailing commas in multiline structures

### TypeScript Guidelines

- Enable strict mode (all strict checks enabled)
- Always provide explicit return types for exported functions
- Use `interface` for object shapes, `type` for unions/aliases
- Prefer `unknown` over `any`
- Use `.js` extensions in imports (for ESM compatibility)

```typescript
// Correct - explicit types, .js extension
import { TokenContext } from './types.js';

export function checkLogLevel(
    config: Pick<ResolvedConfig, 'levels' | 'level'>,
    method: string
): boolean {
    return config.levels[config.level] >= config.levels[method];
}
```

### Naming Conventions

- **Variables/Functions**: camelCase (`generateConfig`, `checkLogLevel`)
- **Interfaces/Types**: PascalCase (`TokenContext`, `ConsoleStampOptions`)
- **Constants**: camelCase (not UPPER_CASE)
- **File names**: lowercase with dots (`utils.ts`, `index.test.ts`)

### Error Handling

- Use try-catch blocks for operations that may fail
- Return the original value on error in token replacement
- Avoid throwing in library code when possible

### Testing Patterns

- Test files use `.test.ts` suffix
- Use `describe()` for grouping related tests
- Use `it()` for individual test cases
- Import from `../src/` during development
- Use SpyStream helper for capturing console output:

```typescript
import { SpyStream } from './helpers/SpyStream.js';

const stdout = new SpyStream();
consoleStamp(console, { stdout });
console.log('test');
expect(stdout.asArray[0]).toContain('test');
```

- Always reset console after tests using `afterEach()`

### Token Implementation

Tokens are functions that receive a context object and return a string:

```typescript
import type { TokenContext } from '../types.js';

export default function myToken({ method, params, msg }: TokenContext): string {
    const [firstParam] = params as [number?];
    return `[${method.toUpperCase()}]`.padEnd(firstParam ?? 7);
}
```

## Key Types

```typescript
interface ConsoleStampOptions {
    format?: string;              // Token format string
    include?: string[];           // Methods to patch
    level?: string;               // Minimum log level
    tokens?: Record<string, TokenFunction>;
    extend?: Record<string, number>;
    stdout?: Writable;
    stderr?: Writable;
    preventDefaultMessage?: boolean;
}

type TokenFunction = (context: TokenContext) => string;

interface TokenContext {
    method: string;
    params: (string | number)[];
    tokens: Record<string, TokenFunction>;
    defaultTokens: Record<string, TokenFunction>;
    msg: string;
}
```

## Key APIs

### consoleStamp(console, options)

Main function that patches console methods.

```typescript
import consoleStamp from 'console-stamp';

consoleStamp(console, {
    format: ':date(yyyy-mm-dd) :label',
    level: 'info',
});
```

### console.reset()

After patching, call `console.reset()` to restore original methods.

### console.org

Object containing original console methods before patching.

## CI/CD

GitHub Actions runs on Node.js 18.x, 20.x, 22.x:
- Triggers on push/PR to main branch
- Runs typecheck, build, then test

## Common Tasks

### Adding a New Token

1. Create file in `src/tokens/` directory
2. Export function receiving `TokenContext` and returning string
3. Re-export from `src/tokens/index.ts`
4. Add to `src/defaults.ts` tokens object
5. Add tests in `test/tokens.test.ts`

### Modifying Console Patching

1. Main logic is in `src/index.ts`
2. Utility functions are in `src/utils.ts`
3. Test changes with integration tests in `test/index.test.ts`

### Publishing

```bash
npm run build && npm run test
npm version <major|minor|patch>
npm publish
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| chalk | ^5.4.1 | Terminal colors (ESM) |
| chalk-template | ^1.1.0 | Tagged template syntax for chalk |
| dateformat | ^5.0.3 | Date formatting |

## Breaking Changes from v3

- Requires Node.js >= 18
- ESM-first (CommonJS via bundled output)
- chalk upgraded to v5 (ESM-only)
- TypeScript types included
- Examples may need updating for chalk-template syntax
