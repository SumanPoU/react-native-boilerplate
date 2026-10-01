# <APP_NAME>

<!-- Template: replace <APP_NAME> above, then delete this comment. Nothing else needs editing to start. -->

Cross platform mobile app built with Expo, Expo Router, and TypeScript.

## Project

Stack: Expo SDK 57, React Native, TypeScript (strict), Expo Router, NativeWind (Tailwind for React Native), React Native Reusables (shadcn style UI components), TanStack Query for server state, Axios for HTTP, TanStack Form for forms, Zod for validation, Zustand for local state, EAS Build and EAS Update. Biome handles linting and formatting. Husky, lint-staged, and commitlint for git hooks.

Package manager: pnpm. Never mix lockfiles.

Layout:

- `src/app/` Expo Router routes, the directory tree is the navigation tree
- `src/app/(tabs)/` bottom tab navigator, `src/app/(auth)/` unauthenticated stack
- `src/app/_layout.tsx` root providers, `src/app/+not-found.tsx` fallback
- `src/components/ui/` React Native Reusables components, copied into the repo and owned by us (Button, Input, Card, Dialog, and so on)
- `src/components/` shared presentational components built from `ui/`, no data fetching
- `src/features/<feature>/` screens, hooks, form components, and feature specific schemas for one feature
- `src/components/form/` reusable TanStack Form field components that wrap the `ui/` inputs (text input, select, switch, submit button)
- `src/store/` Zustand stores, one file per domain (`useAuthStore.ts`, `useSettingsStore.ts`)
- `src/api/` Axios instance (`client.ts`), typed endpoint functions, and TanStack Query hooks
- `src/schemas/` Zod schemas shared across features, inferred types live next to them
- `src/native/` thin wrappers around Expo modules (camera, notifications, storage)
- `src/theme/` JS side of the design tokens: color values needed outside `className` (navigation theme, icon colors, status bar), and shadow helper
- `src/lib/` pure helpers with no React or native imports, including `utils.ts` with the `cn` class merge helper
- `global.css` design tokens as CSS variables (light and dark), the single source of truth for colors and radius
- `tailwind.config.js` maps the CSS variables to Tailwind color names
- `babel.config.js`, `metro.config.js` NativeWind setup
- `components.json` Reusables CLI config
- `app.config.ts` app identity, plugins, permissions
- `eas.json` build profiles
- `.husky/` git hooks (`pre-commit`, `commit-msg`)
- `commitlint.config.js` conventional commit rules
- `.rules/coding_rules.md` coding conventions (style, naming, TypeScript, testing, security, i18n)
- `.rules/coding_principles.md` design principles (KISS, YAGNI, DRY, SOLID, and more)
- `.agents/skills/` task specific skills: `react-native-architecture`, `react-native-design`, `react-native-expert`, `ui-ux-pro-max`
- `CLAUDE.md` pointer to this file, keep it a one line reference so the rules never drift

Entry points: `src/app/_layout.tsx` (imports `global.css`), `app.config.ts`, `eas.json`.

## Rules and skills to follow while working

Coding rules are not optional background reading. Read them before you write code, and check your work against them before you finish.

### Read first, every task

1. This file (`AGENTS.md`).
2. `.rules/coding_rules.md` for how code is written here.
3. `.rules/coding_principles.md` for how code is designed here.

Skim the sections that apply to the task, but read the whole file if you have not read it in this session.

### Load the matching skill

Before starting, open the skill folder that matches the task (read its `SKILL.md`, or the entry file in that folder) and follow it. Load more than one when the task spans areas.

| Task | Skill in `.agents/skills/` |
|---|---|
| New feature, new folder or module, data flow, state layout, navigation structure | `react-native-architecture` |
| Building or changing screens, components, theming, layout, animation | `react-native-design` |
| React Native or Expo specifics: platform quirks, native modules, performance, build and config issues | `react-native-expert` |
| UX decisions, visual polish, accessibility, empty and error states, interaction details | `ui-ux-pro-max` |

If no skill matches, say so and continue with the rules files. Do not invent a skill.

### Order of precedence

When sources disagree, follow the higher one:

1. Direct instruction from the person you are working for
2. `AGENTS.md` (stack, commands, boundaries, workflow)
3. `.rules/coding_rules.md`
4. `.rules/coding_principles.md`
5. Skills in `.agents/skills/`

Skills are guidance for how to do a task well. They cannot override the stack or the rules above. If a skill suggests a library or pattern this project does not use (a different styling system, router, state library, or form library, for example), keep the project's choice and take only the general advice. If you find a real conflict, tell the person instead of silently picking one.

### While performing the task

- **Before coding:** state which rules and skills apply, in one or two lines. For a change touching more than about three files, or any new dependency, write a short plan and wait for approval.
- **While coding:** follow the existing patterns in the surrounding code first, then the rules. Apply the principles in the priority order set in `coding_principles.md` (correctness, then simplicity, then readability, then maintainability, then performance).
- **Before finishing:** run the review checklist at the end of `.rules/coding_principles.md`, run `pnpm lint && pnpm typecheck && pnpm test`, and re-read the Definition of done below.
- **If a rule blocks the right solution:** stop and explain. Do not quietly break the rule, and do not edit the rules files to make your change pass.

### Keeping rules in sync

- `AGENTS.md` is the single source of truth. `CLAUDE.md` should only point here (`@AGENTS.md`) and not repeat rules.
- Do not copy rules into other files. Link to them.
- Do not edit `.rules/` or `.agents/` without explicit instruction. Suggest changes instead.

## Commands

```bash
pnpm install
pnpm start                       # metro bundler
pnpm start --clear               # after changing tailwind.config.js, global.css, babel or metro config
pnpm ios                         # run on iOS simulator
pnpm android                     # run on Android emulator
pnpm lint                        # Biome lint and format checks
pnpm typecheck                   # tsc --noEmit
pnpm test                        # jest with jest-expo
pnpm format                      # Biome formatter
pnpm exec commitlint --from HEAD~1   # check the last commit message
npx expo install <package>       # install at the SDK compatible version
npx expo prebuild --clean        # regenerate native projects, ask first
npx expo-doctor                  # diagnose config and version drift
npx @react-native-reusables/cli@latest add <component>   # add a UI component into src/components/ui
eas build --profile development --platform ios
eas build --profile production --platform all
eas update --branch preview      # OTA update, JS only
```

Use `npx expo install` for any package with a native component, not `pnpm add`. `@tanstack/react-query`, `@tanstack/react-form`, `axios`, and `zod` are JavaScript only, so `pnpm add` is fine for them. The same goes for the styling helpers (`clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss`) and the git tooling (`husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`, `@biomejs/biome`). `nativewind`, `react-native-reanimated`, `react-native-svg`, and `react-native-gesture-handler` have native parts, so install them with `npx expo install`. Use the versions the Reusables docs specify for our Expo SDK. Do not bump the NativeWind or Tailwind major version on your own.

Before saying a task is done, run `pnpm lint && pnpm typecheck && pnpm test` and fix everything reported.

A change to `app.config.ts` plugins, permissions, or a new native dependency requires a new development build. JavaScript only changes reload in the existing build. Changes to `tailwind.config.js`, `global.css`, `babel.config.js`, or `metro.config.js` need a Metro restart with `--clear`, but not a new build unless they add a native dependency.

## Git hooks (Husky, lint-staged, commitlint)

One time setup, already done in the repo:

```bash
pnpm add -D husky @commitlint/cli @commitlint/config-conventional lint-staged
pnpm exec husky init   # adds "prepare": "husky" to package.json and creates .husky/pre-commit
```

`.husky/pre-commit`:

```sh
pnpm lint-staged && pnpm typecheck && pnpm test
```

`.husky/commit-msg`:

```sh
pnpm exec commitlint --edit "$1"
```

`commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

`package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx,json,css}": "biome check --write"
}
```

Rules:

- `pre-commit` runs `lint-staged` on staged files, then `pnpm typecheck`, then `pnpm test`. A failing hook blocks the commit. Fix the cause and commit again.
- `commit-msg` validates the message with commitlint. Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `style`, `ci`, `build`, `revert`.
- Never use `--no-verify` or `HUSKY=0` to get around a hook.
- Hooks do not run `eas build`. An EAS build is remote and takes minutes, so it belongs in CI or a manual run, not in a commit hook.
- `prepare` installs the hooks on `pnpm install`. If hooks are missing in a fresh clone, run `pnpm install` again.

## Definition of done

- The change follows `.rules/coding_rules.md` and `.rules/coding_principles.md`, and the matching skill was consulted.
- Lint, typecheck, and tests pass.
- Git hooks pass without being bypassed.
- Works on both iOS and Android, in light and dark mode.
- Handles loading, empty, error, and offline states.
- No new warnings in the Metro or device console.
- No `console.log`, commented out code, or unresolved TODOs left behind.
- The diff contains only what the task required, with no unrelated refactors.
- PR states whether the change is OTA safe or needs a new build.

## Platform notes

- Test every screen on an iOS simulator and an Android emulator before calling it done.
- Safe areas: use `useSafeAreaInsets` from react-native-safe-area-context. Do not hardcode status bar height. Insets are runtime values, so apply them through the `style` prop, not a class.
- Android back button needs explicit handling on any screen with a modal or a multi step flow.
- Permissions are requested at the moment of use, never on app launch. Both platforms need a usage description in `app.config.ts`.
- Keyboard: `KeyboardAvoidingView` with `behavior="padding"` on iOS and `"height"` on Android.
- Shadows need `elevation` on Android and `shadow*` props on iOS. Tailwind `shadow-*` classes only cover iOS, so use the shadow classes that ship with the Reusables components, or the helper in `src/theme/shadows.ts` when you build something new.
- Fonts and icons load asynchronously. Keep the splash screen up until `useFonts` resolves.
- Use `Platform.select` for small differences, and `.ios.tsx` / `.android.tsx` files when a component diverges heavily. NativeWind also supports `ios:` and `android:` class prefixes for small style differences.
- OTA updates cannot ship native changes. If a change touches native code it needs a store build.

## UI and styling (NativeWind + Reusables)

- Style with NativeWind `className`. `StyleSheet.create` is only for what classes cannot express (see the exceptions below).
- Use semantic token classes: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`. No raw hex values, no `dark:` overrides for colors that a token already handles, no arbitrary values like `w-[137px]` or `text-[#333]`.
- Colors and radius are defined once, as CSS variables in `global.css` (light and dark), and mapped in `tailwind.config.js`. Change the look there, not per component.
- Use the spacing, sizing, and typography scale from Tailwind. Do not invent one off values.
- Class names must appear as complete literal strings. Never build them by concatenation (`` `bg-${color}-500` `` is not detected). Use a lookup object or `cva` variants.
- Merge and conditionally apply classes with `cn(...)` from `src/lib/utils.ts`. Define component variants with `class-variance-authority`.
- Accept and forward `className` on every shared component so callers can adjust layout, and put it last in `cn()` so it wins.
- Allowed exceptions for `style` or `StyleSheet.create`: Reanimated animated styles, values computed at runtime (safe area insets, measured sizes, keyboard height), and list props such as `contentContainerStyle` that do not take `className`. No inline style objects inside render, define them outside or in `StyleSheet.create`.
- Text must use the `Text` component from `src/components/ui/text`, not the React Native one, so text styles inherit through `TextClassContext`.
- Before building a component, check whether Reusables already has it. Add it with the CLI (`npx @react-native-reusables/cli@latest add <component>`) instead of writing it by hand.
- Files in `src/components/ui/` are ours. Edit them when the design needs it, keep their public props stable, and make the change in the component rather than overriding it at every call site. If a tweak is only for one screen, pass `className` instead.
- Reusables components sit on `rn-primitives` (accessible primitives). Keep that layer. Do not replace it with hand built pressables and modals.
- Icons: use `lucide-react-native` wrapped with `iconWithClassName` (or the helper Reusables provides), so icon color follows the same tokens.
- Dark mode follows the system by default. Store an explicit user override in `useSettingsStore`, and apply it with NativeWind's `useColorScheme`. Keep the React Navigation theme colors in `src/theme/` in sync with the CSS variables.
- Do not mix in a second component library or a second styling system.

## Code style

The full conventions live in `.rules/coding_rules.md`. The essentials:

- TypeScript strict. No `any`, no `@ts-ignore` without a comment explaining why.
- Function components and hooks only. No class components.
- Named exports, except route files which require default exports.
- Styling follows the "UI and styling" section above. No raw hex values or magic numbers in components.
- Use `FlashList` or `FlatList` for any list that can exceed ten items. Never map an array into a ScrollView.
- Every list item component is memoized and every list has a stable `keyExtractor`.
- Navigation uses typed routes from Expo Router. No string concatenation for hrefs.
- Native APIs are only called through `src/native/`, so permissions and fallbacks live in one place.
- Images use `expo-image` with an explicit width and height (classes like `w-16 h-16` count).
- Keep components under ~200 lines. Extract hooks for logic, subcomponents for markup.
- Do not add a dependency for something achievable in a few lines. Reusables components and their `rn-primitives` are the accepted exception for UI.

## Design principles

The full set lives in `.rules/coding_principles.md`. The short version:

- Keep it simple (KISS) and build only what the task needs (YAGNI).
- Give each piece of knowledge one home (DRY), but do not abstract before the third repetition.
- Follow SOLID: one responsibility per unit, extend instead of editing, keep contracts stable, keep props small, depend on hooks and wrappers rather than concrete libraries.
- Store each piece of state once and derive the rest.
- Model states so invalid ones cannot exist, and parse external data with Zod.
- Fail loudly and early. Never swallow errors.
- Optimize only after measuring.

## State (Zustand)

- Server state belongs to TanStack Query. Form state belongs to TanStack Form. Other local UI state belongs to component state or Zustand. Do not mirror server data or form values in a store.
- One store per domain in `src/store/`, named `use<Domain>Store`. No single global store.
- Always select with a selector: `useAuthStore((s) => s.user)`. Never subscribe to the whole store.
- Use `useShallow` when selecting multiple fields.
- Keep actions inside the store next to the state they change. Components call actions, they do not `set` directly.
- Persist only what must survive restarts, via the `persist` middleware with a storage adapter from `src/native/`. Never persist tokens in plain AsyncStorage, use secure storage.
- Version persisted stores and provide a `migrate` function when the shape changes.
- Reset stores on logout.
- Stores are tested as plain functions, without rendering components.

## Data and networking (Axios + TanStack Query)

- One Axios instance in `src/api/client.ts` with `baseURL`, `timeout`, and default headers. Never call `axios.get` or create ad hoc instances elsewhere.
- Auth token is attached in a request interceptor. 401 handling (refresh or logout) lives in a response interceptor, in that file only.
- Endpoint functions live in `src/api/<domain>.ts`, are fully typed, and return parsed data, not the raw `AxiosResponse`.
- Parse every response with Zod at the boundary: `UserSchema.parse(res.data)`. Do not trust the wire shape.
- Components never import Axios. They use TanStack Query hooks from `src/api/`.
- Reads use `useQuery`, writes use `useMutation`. Hooks are named `useUser`, `useUpdateUser`.
- Query keys come from a per domain key factory (`userKeys.detail(id)`). No inline array literals.
- Set `staleTime` deliberately per query. Invalidate the affected keys in a mutation's `onSuccess`.
- Every query and mutation handles loading and error state in the UI.
- Never retry non-idempotent mutations automatically. Set `retry: false` on them.
- Normalize errors once in the response interceptor into an `ApiError` type with `status`, `code`, and a user safe `message`.
- Base URLs and keys come from environment config, never hardcoded.
- Use `AbortSignal` from the query function for cancellation: `client.get(url, { signal })`.

## Forms (TanStack Form + Zod)

- Every form uses `useForm` from `@tanstack/react-form`. No `useState` per field, no other form library.
- Every form has a Zod schema. Define it in `src/schemas/` or the feature's `schemas.ts`, and derive the type with `z.infer`. Never write the form type by hand.
- Pass the schema through `validators`, not per field rules:

```tsx
const form = useForm({
  defaultValues: { email: '', password: '' } satisfies LoginInput,
  validators: { onChange: loginSchema, onSubmit: loginSchema },
  onSubmit: async ({ value }) => {
    await login.mutateAsync(value);
  },
});
```

- Render inputs with `form.Field` and the shared components in `src/components/form/`, which wrap the Reusables `Input`, `Label`, `Select`, `Switch`, and `Button`. Wire `onChangeText` to `field.handleChange` and `onBlur` to `field.handleBlur`.
- Show a field error only after the field is touched: `field.state.meta.isTouched`. Errors from Zod are issue objects, read `.message`. Render the error with the `text-destructive` token and mark the input invalid for accessibility.
- Submit with `form.handleSubmit()`. Read `canSubmit` and `isSubmitting` through `form.Subscribe`, and disable the submit button while submitting.
- Submit calls a TanStack Query mutation. Map `ApiError` field errors back onto the form, and show general errors in a banner.
- Reuse the same Zod schema to validate the request payload when it matches, so client and API contracts stay aligned.
- Give every input the right `keyboardType`, `autoComplete`, `textContentType`, and `returnKeyType`, and move focus to the next field on submit.
- Wrap forms in `KeyboardAvoidingView` (see platform notes) and make the screen scrollable so the submit button stays reachable.
- Reset the form after a successful submit only when the screen stays open.

## Security and secrets

- Never commit secrets, tokens, or keystores. `.env` is off limits.
- Public config uses `EXPO_PUBLIC_*` variables. Anything else is a secret and must not ship in the bundle.
- Store tokens and credentials with `expo-secure-store`, never AsyncStorage.
- Do not log PII, tokens, or full request bodies. Do not enable Axios debug logging in production builds.

## Accessibility

- Reusables components come with roles and states from `rn-primitives`. Keep them when you edit a component.
- Every touchable you build yourself has `accessibilityRole` and an `accessibilityLabel` when it has no visible text. Icon only buttons always need a label.
- Minimum touch target 44x44 pt. Check that `size` variants (for example a small icon Button) still meet this, and use `hitSlop` when they do not.
- Support dynamic type: do not lock font sizes or clip text.
- Do not convey meaning by color alone.
- Check contrast for both light and dark token values in `global.css`.

## Performance

- Avoid inline functions and object literals as props on memoized or list children.
- Use `useCallback` and `useMemo` where they prevent measurable re-renders, not by default.
- Animate with Reanimated on the UI thread. Do not animate layout with `setState`.
- Check bundle impact before adding a dependency.
- Keep `className` strings on list items static or computed through `cva` and `cn` outside of hot paths.

## Boundaries

Do not touch without explicit instruction:

- `ios/` and `android/` directories. They are generated by prebuild.
- `app.config.ts` bundle identifier, package name, scheme, version, or build number.
- `eas.json` build profiles and any signing credential.
- `pnpm-lock.yaml`, `.env`, store metadata and screenshots.
- `babel.config.js` and `metro.config.js` NativeWind setup.
- `.husky/` hooks and `commitlint.config.js`.
- `.rules/`, `.agents/`, `CLAUDE.md`, and `skills-lock.json`. These define how agents work, so suggest changes instead of making them.

Needs human review: new native dependencies, permission additions, push notification handling, deep links, auth flow changes, analytics events, changes to the design tokens in `global.css` and `tailwind.config.js`, upgrades of NativeWind, Tailwind, or `rn-primitives`, changes to the git hooks or commitlint rules.

Version numbers are set by the release process, not by a code change.

## Testing

- `pnpm test` runs Jest with the jest-expo preset.
- Required tests: everything in `src/api/` (request shaping, Zod response parsing, error normalization, mock Axios with `axios-mock-adapter`), every Zod schema in `src/schemas/` (valid and invalid cases), helpers in `src/lib/`, and Zustand stores.
- Component tests use @testing-library/react-native and cover behavior, not layout or class names. Wrap them in a fresh `QueryClientProvider` with `retry: false`.
- Query components by role, label, or text, not by `className`.
- Form tests fill fields, submit, and assert validation messages and the mutation call.
- Native module wrappers are tested with the Expo module mocked.
- Interaction, layout, and dark mode appearance are verified on device, not in the test suite.
- When fixing a bug, add a failing test first when the code is testable.
- Never delete, skip, or weaken a test, and never add `@ts-ignore` or mock away the code under test just to get a green run. Fix the cause.
- The `pre-commit` hook runs the full test suite, so keep tests fast and deterministic.

## Git workflow

- Branch from `main`: `feat/short-description`, `fix/short-description`, `chore/short-description`.
- Conventional commits, enforced by commitlint in the `commit-msg` hook. Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `style`, `ci`, `build`, `revert`. Example: `fix(onboarding): keep keyboard clear of the submit button`.
- The `pre-commit` hook runs `lint-staged`, then `pnpm typecheck`, then `pnpm test`. A failing hook blocks the commit, so fix the cause.
- Never use `--no-verify` or `HUSKY=0` to get around a hook.
- Small, focused PRs. One concern per PR. Do not mix refactors with feature work in one commit.
- PR description includes screenshots or a screen recording from both iOS and Android, in light and dark mode for UI changes.
- State in the PR whether the change is OTA safe or requires a new build.
- Never commit to `main`. Never force push shared branches.

## Working agreement for agents

Follow "Rules and skills to follow while working" above for every task. In addition:

**Scope**
- Read the surrounding code and follow existing patterns before writing new ones.
- Prefer the smallest change that solves the task. Do not refactor unrelated code, rename or move files, or "improve" things on the side.
- Check `src/components/ui/` before creating a new component, and use the Reusables CLI for missing primitives.

**Verify, do not assume**
- Do not invent package names, APIs, props, or Expo SDK 57 features. When unsure, check the official docs or the installed package in `node_modules`.
- Install native packages with `npx expo install`, not `pnpm add`.

**Ask first**
- If a requirement is ambiguous or touches a boundary above, ask before proceeding.
- Ask before destructive or wide reaching actions: deleting files, `npx expo prebuild --clean`, resetting git history, changing lockfiles, or anything with side effects outside the repo.
- For a change touching more than about three files, or adding a dependency, share a short plan first and wait for approval.

**When things fail**
- If a command fails, report the actual error. Do not silence it or work around it.
- If a git hook fails, report the actual error and fix it. Do not bypass hooks.
- If a rule, skill, or instruction conflicts with another, say so instead of picking silently.

**Commits**
- Write commit messages that pass commitlint on the first try.
- Keep commits small and focused, one concern each.

**Reporting**
- Never claim something works on a platform you did not run it on. Say what was and was not verified.
- Finish with a summary: what changed, which rules and skills applied, how it was verified (and on which platform), what was not verified, and any follow-ups.
