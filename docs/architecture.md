# Architecture

This document will track the intended system architecture for
zk-inference-monitor as components are added.

## Current baseline

- Runtime: Node.js 20+, TypeScript (strict mode)
- Entry point: `src/index.ts`
- Configuration: environment-variable driven, see `.env.example`
- Tests: Jest via `tests/`

## Structure

```
src/     application source code
tests/   automated tests (unit/integration)
docs/    project documentation
```

Further architectural detail (data flow, monitored components, proof
verification pipeline) will be added as those pieces are implemented.
