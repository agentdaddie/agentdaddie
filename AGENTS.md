# Agent Rules

## Data Fetching
- Always use `useSWR` for client-side data fetching.
- Always use `axios` inside fetchers.
- Keep all fetcher functions in `/src/lib/fetchers.ts`.

## Types
- Always add shared types in `/src/lib/type.ts`.
- Prefer `interface` for type definitions in most cases.

- Never use `any` or `unknown` types.
- Always add valid, explicit types.
