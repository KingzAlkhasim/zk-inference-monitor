# zk-inference-monitor

## Requirements

- Node.js 20+

## Setup

```bash
npm install
cp .env.example .env
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the entry point with live reload (ts-node-dev) |
| `npm run build` | Type-check and compile to `dist/` |
| `npm run typecheck` | Type-check without emitting |
| `npm start` | Run the compiled build from `dist/` |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint `src/` and `tests/` |
| `npm run clean` | Remove build and coverage output |

## Structure

```
src/     application source code
tests/   automated tests
docs/    project documentation
```

No infrastructure beyond this baseline has been introduced; it will be
added incrementally as subsequent issues require it.
