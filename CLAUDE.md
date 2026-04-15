# CLAUDE.md — Time Cost (Chrome Extension)

> Claude Code-specific instructions. The canonical agent guide is **[AGENTS.md](./AGENTS.md)** — read that first.

---

## Quick Reference

See `AGENTS.md` for:

- Layer architecture and forbidden import rules
- Naming conventions (Portuguese field names)
- Build & development commands
- Design patterns
- Known pitfalls

---

## Claude Code Permissions

The following `npm` commands are pre-approved and can run without prompting:

```bash
npm run dev
npm run build
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run typecheck
npm run validate
```

---

## Workflow for Claude Agents

1. **Before any change:** Read `AGENTS.md` to understand architecture constraints.
2. **After any change:** Run `npm run validate` (typecheck → lint → test).
3. **When adding new logic:** Run `npm run test:coverage` to verify thresholds.
4. **Before committing:** Pre-commit hooks run automatically — no `--no-verify`.

---

## Common Error → Fix Mapping

| Error message                               | Root cause                    | Fix                                                 |
| ------------------------------------------- | ----------------------------- | --------------------------------------------------- |
| `Architecture: core/ imports from storage/` | Import crosses layer boundary | Move shared logic to `core/types.ts` or restructure |
| `@typescript-eslint/no-explicit-any`        | Used `any` type               | Use `unknown` or define a proper type               |
| `consistent-type-imports`                   | Mixed value/type import       | Use `import type { Foo }` for type-only imports     |
| `Coverage below threshold`                  | New code without tests        | Add tests in `*.test.ts` beside the source file     |
