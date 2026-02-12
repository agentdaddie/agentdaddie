# Agent Rules

## Data Fetching
- Always use `swr` for client-side data fetching. - (already installed)
- Always use `axios` inside fetchers. - (already installed)
- Keep all fetcher functions in `/src/lib/fetchers.ts`.

## Types
- Always add shared types in `/src/lib/type.ts`.
- Prefer `interface` for type definitions in most cases.

- Never use `any` or `unknown` types.
- Always add valid, explicit types.
