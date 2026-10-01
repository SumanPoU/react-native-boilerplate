# Engineering Rules

You are an expert in TypeScript, React Native, Expo, and mobile UI development.

These rules are the general engineering standards for this repo. They complement `AGENTS.md`, which defines the exact stack, commands, boundaries, and workflow. **If anything here conflicts with `AGENTS.md`, `AGENTS.md` wins.**

Stack reminder (details in `AGENTS.md`): Expo, Expo Router, TypeScript strict, NativeWind + React Native Reusables, TanStack Query/Form, Axios, Zod, Zustand, pnpm.

---

## 1. Code style and structure

- Write concise, technical, type-safe TypeScript. Code should be easy to read; use descriptive names.
- Use functional and declarative patterns. No classes, no class components.
- Prefer iteration and modularization over duplication.
- Keep components small and single-purpose (under ~200 lines). Extract hooks for logic and subcomponents for markup.
- Organize by feature: group related screens, components, hooks, and schemas under `src/features/<feature>/`.
- File order: exported component, subcomponents, helpers, static content, types.
- Use the `function` keyword for pure functions and top-level components; arrow functions for callbacks.
- Use modern JS: destructuring, template literals, optional chaining.
- Avoid global variables and module-level mutable state.
- Use concise conditionals: no unnecessary braces for simple single statements.
- Format and lint with Biome. Never hand-format.
- Do not add a dependency for something achievable in a few lines.

## 2. Naming

| Thing | Convention | Example |
|---|---|---|
| Variables, functions | camelCase | `handleUserInput` |
| Booleans | auxiliary verb prefix | `isLoading`, `hasError`, `canSubmit` |
| Components | PascalCase | `UserProfile` |
| Directories | lowercase-with-dashes | `auth-wizard`, `chat-screen` |
| Hooks | `use` prefix | `useUpdateUser` |
| Zustand stores | `use<Domain>Store` | `useAuthStore` |

- Prefer named exports. Default exports only where Expo Router requires them (route files).

## 3. TypeScript

- TypeScript everywhere, `strict: true`.
- No `any`. Use precise types, `unknown` plus narrowing when needed. No `@ts-ignore` without an explanatory comment.
- Prefer `interface` for object shapes and component props; use `type` for unions, mapped, and inferred types.
- No `enum`. Use literal unions or `as const` maps.
- Derive types from Zod schemas with `z.infer`. Never hand-write a type that a schema already defines.
- Type components with a props interface and plain function signatures. Do not use `React.FC`.
- Use typed routes from Expo Router.

## 4. Components and hooks

- Prefer derived state and memoization over `useEffect` + `setState`. Minimize both.
- Every effect has a clear dependency list and cleanup where needed.
- Use `React.memo` for list items and components with stable props. Use `useCallback` / `useMemo` where they prevent measurable re-renders, not by default.
- Do not pass anonymous functions or inline object literals to memoized or list children (`renderItem`, handlers). Define them outside render or memoize them.
- Lazy load non-critical screens and components (`React.lazy`, `Suspense`, dynamic imports).
- Keep presentational components free of data fetching; hooks own data.

## 5. UI and styling

- Style with NativeWind `className` and semantic tokens (`bg-background`, `text-foreground`). Use `StyleSheet.create` only where classes cannot express it. Follow the "UI and styling" section of `AGENTS.md`.
- Use React Native Reusables components before building your own. Do not introduce Tamagui, styled-components, or another styling system.
- Design mobile first. Use Flexbox and `useWindowDimensions` for responsive layout; support different screen sizes and orientations.
- Support light and dark mode via the token system and NativeWind's `useColorScheme`.
- Animations and gestures: `react-native-reanimated` and `react-native-gesture-handler`, on the UI thread. Never animate layout with `setState`.
- Images: `expo-image` with explicit dimensions, WebP where supported, lazy loading. Do not use `react-native-fast-image`.
- Safe areas: `SafeAreaProvider` at the root, `useSafeAreaInsets` for runtime values. Never hardcode status bar or notch padding.
- Lists: `FlashList` / `FlatList` for anything that can exceed ten items, never `ScrollView` + `map`. Tune with `getItemLayout` (fixed-size rows), `removeClippedSubviews`, `maxToRenderPerBatch`, `windowSize`, and a stable `keyExtractor`.

## 6. Accessibility

- Every custom touchable has `accessibilityRole`; icon-only controls always have an `accessibilityLabel`.
- Minimum touch target 44x44 pt (`hitSlop` if smaller).
- Respect dynamic type and font scaling; never lock text sizes or clip text.
- Do not convey meaning by color alone; check contrast in both themes.
- Use native accessibility props (`accessibilityRole`, `accessibilityState`, `accessibilityHint`), not web ARIA attributes.

## 7. Navigation

- Expo Router file-based routing is the only navigation system. Do not add React Navigation routers or Solito.
- Use typed hrefs; no string concatenation for routes.
- Configure deep links and universal links through `app.config.ts` and Expo Router; treat deep-link input as untrusted.
- Handle the Android back button on modal and multi-step screens.
- Use dynamic routes (`[id].tsx`) and layouts (`_layout.tsx`) for shared navigation chrome.

## 8. State and data

- Server state: TanStack Query. Form state: TanStack Form. Local UI state: component state. Cross-screen client state: Zustand. Do not mirror one in another.
- Use Zustand with selectors and `useShallow`. Do not use Context + `useReducer` as a global store, and do not add Redux.
- Use a single Axios instance, Zod-parse every response, and use query key factories (see `AGENTS.md` for the full rules).
- Avoid excess API calls: set `staleTime` deliberately, dedupe through Query, cancel with `AbortSignal`.

## 9. Error handling and validation

- Validate at boundaries with Zod: API responses, form input, deep-link params, persisted state, environment config.
- Handle errors and edge cases first in a function. Use guard clauses and early returns; avoid deep nesting and needless `else`.
- Use `if (...) return` instead of `else` chains.
- Normalize errors into a single `ApiError` shape with a user-safe message; never show raw error text or stack traces to users.
- Add a global error boundary at the root and per-route boundaries via Expo Router's `ErrorBoundary` export.
- Report production errors to Sentry (`sentry-expo` / `@sentry/react-native`). Never log PII, tokens, or full request bodies.
- Every screen handles loading, empty, error, and offline states.

## 10. Performance

- Target smooth 60fps: keep JS-thread work light, push animation to the UI thread.
- Minimize re-renders: selectors, memoized list items, stable props.
- Keep the splash screen visible until fonts and critical assets load (`expo-splash-screen` with `useFonts`). Do not use the deprecated `AppLoading`.
- Check bundle size impact before adding a dependency; lazy load heavy or rarely used modules.
- Profile with React DevTools, the React Native performance monitor, and Flipper/Expo dev tools before optimizing. Measure first.
- Use Hermes and production builds when judging performance.

## 11. Security

- No secrets, tokens, or keystores in the repo. Only `EXPO_PUBLIC_*` values may ship in the bundle, and they are public.
- Store tokens and sensitive data with `expo-secure-store`, never plain AsyncStorage.
- HTTPS only. Attach auth in the Axios request interceptor.
- Sanitize and validate all user input; never render untrusted HTML. If a WebView is required, restrict origins and disable unneeded JS bridges.
- Request permissions at the moment of use, with a usage description in `app.config.ts`. Use each module's own permission API (for example `expo-camera`, `expo-notifications`), not the removed `expo-permissions`.
- Follow Expo's security guidance: https://docs.expo.dev/guides/security/

## 12. Internationalization

- All user-facing text goes through i18n. No hardcoded strings in components.
- Use `expo-localization` to detect locale, with `i18next` + `react-i18next` for translation, plurals, and interpolation.
- Support multiple languages and RTL layouts (use `start` / `end` rather than `left` / `right` where possible).
- Format dates, numbers, and currency with `Intl` APIs or locale-aware helpers.
- Ensure layouts survive longer translations and larger font scales.

## 13. Testing

- Jest with `jest-expo` and React Native Testing Library. See `AGENTS.md` for required coverage areas.
- Unit test pure logic, schemas, stores, and API modules; component tests cover behavior, not class names or layout.
- Query by role, label, or text.
- Use Detox (or Maestro) for end-to-end tests of critical flows, such as onboarding, auth, and purchase.
- Snapshot tests only for small, stable components; do not rely on them for behavior.
- Verify layout, gestures, and dark mode on real devices or simulators on both iOS and Android.
- Add a failing test first when fixing a bug.

## 14. Build, release, and deployment

- Use Expo's managed workflow. Do not edit `ios/` or `android/` by hand; they come from prebuild.
- Use EAS Build for binaries and EAS Update for JS-only OTA updates (configure `expo-updates`).
- OTA updates cannot ship native changes. Any new native module, permission, or plugin needs a new build.
- Keep configuration in `app.config.ts`, read at runtime via `expo-constants`; keep per-environment values in EAS profiles and environment variables.
- Follow Expo's deployment guide: https://docs.expo.dev/distribution/introduction/
- Test on both iOS and Android before calling anything done.

## 15. Documentation and commits

- Use conventional commits with descriptive messages (enforced by commitlint).
- Comment the why, not the what. Remove commented-out code and stale TODOs.
- Follow the official documentation for Expo, Expo Router, NativeWind, React Native Reusables, TanStack, and Zod. Prefer current APIs over deprecated ones.
- Code examples you provide should be correct, complete, and production ready, with brief explanations only where the logic is non-obvious.

---

## Deliberately excluded

These appeared in earlier rule sets but conflict with the current stack. Do not introduce them:

- **Tamagui, styled-components, Tailwind via other tooling**: replaced by NativeWind + Reusables.
- **React Navigation as primary router, Solito**: replaced by Expo Router.
- **Next.js, Turbo monorepo, Supabase, Stripe, tRPC generators**: not part of this project. Add a dedicated section if the project adopts them.
- **Context + `useReducer` for global state, Redux Toolkit**: replaced by Zustand.
- **PropTypes, `React.FC`, enums**: replaced by strict TypeScript conventions.
- **`react-native-fast-image`, `react-native-encrypted-storage`, `expo-permissions`, `expo-error-reporter`, `AppLoading`, `react-native-i18n`**: deprecated, unmaintained, or nonexistent; use the replacements named above.
