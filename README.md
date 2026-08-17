# HearthstoneBrowser

A bare React Native CLI app that fetches Hearthstone cards from the [hearthstone11 RapidAPI](https://rapidapi.com/), lets you search them by name, and shows full card details on click.

## App structure

```
src/
├── app/                        
├── core/                       
│   ├── config/                 
│   ├── errors/                 
│   └── network/                
├── features/
│   └── cards/
│       ├── domain/     
│       ├── data/              
│       ├── di/           
│       ├── providers/          
│       └── presentation/       
├── shared/                     
└── test/                       
```

The codebase is **feature-based, with Clean Architecture inside each feature**: every feature (currently `cards`) owns its own `domain` (entities and use cases, pure TypeScript), `data` (DTO schemas, mappers, repository implementation), and `presentation` (screens, components, query hooks) slices, while `core` and `shared` hold feature-agnostic infrastructure and UI.

## Versions and libraries

Built against **React Native 0.86.2** (React 19.2.3, New Architecture). Node ≥ 22.11 is required.

| Library | Why |
| --- | --- |
| `@tanstack/react-query` | Server state: caching per search term, infinite scroll pagination |
| `axios` | Hidden behind the `HttpClient` interface |
| `zod` | Runtime validation |
| `@shopify/flash-list` | For showing list of cards |
| `@react-navigation/native-stack` | Navigation between list and details |
| `react-native-safe-area-context` | Edge-to-edge safe area insets |

Testing and quality: Jest, React Native Testing Library, ESLint (with the import-boundary rules above and the TanStack Query plugin), Prettier.

## Search: server-side vs. client-side

Search is implemented **server-side**. While exploring the API I found it accepts a `search` query parameter on `/cards`, so the app forwards the (debounced) search query to the server.

The alternative, filtering the already-fetched pages locally would be wrong from a product pov. The list is paginated, so a local filter can only ever search the records the user happens to have scrolled through, silently missing every card not yet fetched. As a user, searching should mean searching all the cards.

Details around it: input is debounced so the API isn't hit per keystroke, search query shorter than 3 characters are ignored, and each search query gets its own React Query cache key so previously fetched results come back instantly.

## Remove duplicate items from list based on slug

I observed that the `/cards` endpoint returns a list of cards with same slug but with different id. But since there is only one endpoint to get the card detail via the slug name, which meant we always were taken to same card details. Hence I decided to filter out the list with same slug name so that our list contains unique items. Obviously there are different ways to handle like merging the items with same slug or creating a new end point to get details by id(assuming we have contro over the BE), for now I decided to just to filter out for simplicity.

## Future improvements

- **Offline support** — skipped since it was not in the requirements. Could be added with the official `@tanstack/react-query-persist-client` (plus an MMKV/AsyncStorage persister) to persist the React Query cache, so previously seen cards survive a cold start without a connection.
- **Logger** — a small logging abstraction with a crash-reporting sink (Sentry / Crashlytics), the ErrorBoundary currently only reports through `console.error`.
- **Translations** — all copy is hardcoded English; extract to an i18n layer (e.g. `i18next`).
- **E2E tests** — Maestro or Detox flows on a simulator for the two core journeys.
- **CI/CD** — Running `typecheck`, `lint`, and `test`.

## How to run

Prerequisites: [React Native environment](https://reactnative.dev/docs/set-up-your-environment) for your platform, Node ≥ 22.11, JDK 17 for Android, Xcode + CocoaPods for iOS.

**1. Install dependencies**

```sh
npm install
```

**2. Configure the API key**

```sh
cp .env.example .env
```

Set `RAPIDAPI_KEY` in `.env`.

**3. iOS only: install pods**

```sh
bundle install
bundle exec pod install --project-directory=ios
```

**4. Start Metro and run**

```sh
npm start
```

```sh
npm run android
```

```sh
npm run ios
```

**Quality checks**

```sh
npm run typecheck
npm run lint
npm test
```

Troubleshooting: if the Android build fails during the CMake step, make sure `JAVA_HOME` points at a JDK 17 (newer JDKs break the Android Gradle Plugin).

## Demo

https://github.com/user-attachments/assets/60ad7c41-d0b4-4d59-9f2b-ad1f7d993003



