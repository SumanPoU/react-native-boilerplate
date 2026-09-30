# Coding Principles

Design principles that guide every change in this repo. They apply on top of `AGENTS.md` (stack, commands, boundaries) and `coding_rules.md` (style and conventions). If they conflict, `AGENTS.md` wins.

Principles are tools, not laws. When two pull in opposite directions, use the priority order below.

## Priority order when principles conflict

1. **Correctness and safety** (security, data integrity, accessibility)
2. **Simplicity** (KISS, YAGNI)
3. **Readability** (clear names, small units)
4. **Maintainability** (SOLID, DRY, separation of concerns)
5. **Performance** (only after measuring)

Example: do not add an abstraction to satisfy DRY if it makes the code harder to read (rule 2 beats rule 4).

---

## 1. KISS: Keep It Simple

- Choose the simplest solution that meets the requirement.
- Prefer plain functions, plain objects, and built-in React features over clever patterns.
- If a reviewer needs a long explanation to follow the code, simplify it.
- Avoid nested ternaries, deeply chained array methods, and one-line "clever" tricks. Use early returns and named intermediate variables.

```tsx
// Bad
const label = a ? (b ? 'x' : c ? 'y' : 'z') : 'w';

// Good
function getLabel({ a, b, c }: Flags) {
  if (!a) return 'w';
  if (b) return 'x';
  return c ? 'y' : 'z';
}
```

## 2. YAGNI: You Aren't Gonna Need It

- Build only what the current task requires. No speculative props, options, hooks, config flags, or "future" layers.
- Do not add a store, context, or provider until two or more places need it.
- Do not add generic parameters or plugin points for hypothetical use cases.
- Delete unused code, props, exports, and dependencies. Git remembers them.
- Do not add a dependency for something achievable in a few lines.

## 3. DRY: Don't Repeat Yourself

- Every piece of knowledge has one authoritative home: one Zod schema per shape, one Axios instance, one set of design tokens, one query key factory.
- **Rule of three:** tolerate duplication twice; extract on the third occurrence, once the shared shape is clear.
- Duplication of *code* is fine if the *concepts* differ. Two forms that look alike today but change for different reasons should stay separate.
- A wrong abstraction is worse than duplication. If an abstraction needs boolean flags to handle special cases, split it back apart.
- Derive, do not copy: infer types from Zod (`z.infer`), compute values instead of storing them in state, take colors from tokens.

## 4. SOLID

### S: Single Responsibility
- A component, hook, or function has one reason to change.
- Screen components compose; hooks hold logic; `src/api/` talks to the network; `src/native/` wraps device APIs; `src/lib/` holds pure helpers.
- If a name needs "and" (`FetchAndRenderUser`), split it.

### O: Open/Closed
- Extend behavior without editing working code: add a `cva` variant, accept `className`, pass `children` or render props, or add a new route file.
- Do not add a new `if (type === ...)` branch in five places. Use a lookup map or polymorphism through composition.

```tsx
// Open for extension: add an entry, no logic changes
const statusBadge = {
  pending: 'bg-muted text-muted-foreground',
  paid: 'bg-primary text-primary-foreground',
  failed: 'bg-destructive text-destructive-foreground',
} as const;
```

### L: Liskov Substitution
- A component that wraps or replaces another must honor the same props contract. A custom `Button` must still accept and behave with everything the base `Button` accepts (`onPress`, `disabled`, `accessibilityLabel`, `className`).
- Do not narrow accepted inputs or surprise callers with new required behavior.
- Prefer forwarding props (`...rest`) so wrappers stay substitutable.

### I: Interface Segregation
- Components take only the props they use. Do not pass a whole `user` object to something that renders a name; pass `name`.
- Keep props interfaces small and focused. Split a fat interface into smaller ones.
- Select only the Zustand fields you need (`useStore((s) => s.user.id)`).

### D: Dependency Inversion
- High-level code depends on abstractions, not concrete modules. Screens depend on hooks such as `useUser()`, not on Axios. Features call `src/native/` wrappers, not Expo modules directly.
- Inject dependencies (as props, hook arguments, or provider values) so they can be replaced in tests.
- Business logic must not import from UI, and UI must not know the wire format.

## 5. Separation of Concerns

- Keep presentation, state, data access, and platform code in separate layers (see layout in `AGENTS.md`).
- No fetching inside presentational components. No styling logic inside API functions. No navigation inside pure helpers.
- Validation lives in Zod schemas, not scattered through handlers.

## 6. High cohesion, low coupling

- Keep things that change together in the same folder (`src/features/<feature>/`).
- Features do not import from each other's internals. Share through `src/components/`, `src/lib/`, or `src/schemas/`.
- Import through a feature's public entry, not deep paths into its files.
- Avoid circular imports; they are a design smell.

## 7. Composition over inheritance

- Build UI by composing small components, hooks, and `children`. Never extend a component class.
- Reuse stateful logic with custom hooks, not with higher-order components or mixins.
- Prefer several small components with slots over one component with 15 props.

## 8. Single source of truth

- Each piece of state lives in exactly one place: server data in TanStack Query, form values in TanStack Form, UI state locally, shared client state in one Zustand store.
- Never duplicate state that can be derived. Compute it during render or with `useMemo`.
- Colors, spacing, and radius come from the token system, not from literals.

## 9. Make illegal states unrepresentable

- Model state with discriminated unions instead of loose booleans.
- Use literal unions and `as const` maps instead of enums or magic strings.
- Parse data at the boundary (Zod) so the rest of the code can trust its types.

```ts
// Bad: 8 possible combinations, most invalid
interface State { isLoading: boolean; isError: boolean; data?: User }

// Good: only valid states exist
type State =
  | { status: 'loading' }
  | { status: 'error'; error: ApiError }
  | { status: 'success'; data: User };
```

## 10. Pure functions and immutability

- Prefer pure functions: same input, same output, no side effects. Keep them in `src/lib/`.
- Never mutate props, state, or store objects. Return new values (`{ ...state, x }`, `map`, `filter`).
- Push side effects to the edges: event handlers, effects, mutations, and `src/native/`.
- Command-query separation: a function either returns a value or changes something, not both.

## 11. Fail fast

- Validate inputs and preconditions at the top of a function and return or throw immediately (guard clauses).
- Prefer loud, typed failures over silent fallbacks. Do not swallow errors with empty `catch`.
- Never fake success. Surface real errors to the UI and the logger.

## 12. Explicit over implicit

- Make dependencies, side effects, and data flow visible: pass values as props, name effects for what they do, avoid hidden globals.
- No magic numbers or strings; name them as constants.
- Type return values of exported functions. Avoid implicit `any`.

## 13. Law of Demeter (least knowledge)

- A unit talks to its direct collaborators only. Avoid long chains like `order.customer.address.city.name`; expose a purpose-built field, selector, or helper.
- Components should not reach into another component's internals through refs or child inspection.

## 14. Principle of least astonishment

- Code, names, and APIs behave the way a reader would expect.
- `getX` does not mutate; `isX` returns a boolean; `useX` is a hook; `handleX` handles an event.
- Follow existing patterns in the codebase before introducing a new one.

## 15. Avoid premature optimization

- Make it correct, then clear, then fast, and only optimize with measurements (profiler, flamegraph, real device).
- Do not sprinkle `useMemo` / `useCallback` by default. Use them where they prevent a measured re-render or where referential stability is required (memoized children, effect deps).
- Exception: obvious wins that cost nothing, such as `FlashList` for long lists and memoized list items.

## 16. Boy Scout rule and refactoring

- Leave the code slightly cleaner than you found it, but only within the area you are touching.
- Do not mix refactors with feature work in one commit. Keep PRs focused.
- Refactor under passing tests. If code is untested, add a characterization test first.
- Rename unclear things as soon as you understand them.

## 17. Readability and naming

- Code is read far more than it is written. Optimize for the next reader.
- Names describe intent, not implementation (`isEligibleForDiscount`, not `flag2`).
- Functions do one thing at one level of abstraction and stay short.
- Comments explain *why*, not *what*. If a comment explains what, rename or extract instead.

## 18. Testability as a design constraint

- If code is hard to test, its design is probably wrong: too many responsibilities, hidden dependencies, or side effects mixed with logic.
- Extract logic into pure functions and hooks; keep components thin.
- Test behavior through the public interface, not implementation details.

---

## Quick review checklist

Before finishing a change, ask:

- [ ] **KISS:** Is there a simpler way to do this?
- [ ] **YAGNI:** Did I add anything nobody asked for?
- [ ] **DRY:** Is any knowledge defined in two places? (Or did I abstract too early?)
- [ ] **SRP:** Does each function, hook, and component have one reason to change?
- [ ] **OCP / DIP:** Can I extend this without editing it, and can I swap its dependencies in tests?
- [ ] **ISP:** Does each component receive only the props it uses?
- [ ] **State:** Is every piece of state stored once, with derived values computed?
- [ ] **Types:** Are invalid states unrepresentable, and is external data parsed with Zod?
- [ ] **Errors:** Do failures surface clearly instead of being swallowed?
- [ ] **Scope:** Is the diff focused, with no unrelated refactors?