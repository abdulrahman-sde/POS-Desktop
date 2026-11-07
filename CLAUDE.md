# Babar Trades

Electron + React 19 + TypeScript desktop POS/accounting app (electron-vite, Tailwind v4, shadcn `base-nova`).

## Rules

- **Never use bold fonts.** No `font-bold`, `font-semibold`, `font-extrabold`, `font-black` (or `<b>`/`<strong>`), including inside shadcn components. Create hierarchy with size, colour and spacing instead.
- **Icons: use `reicon-react` only.** Never use `lucide-react` (removed from the project). If a shadcn component pulls in lucide icons, replace them with reicon-react equivalents.
- Fonts: Geist Variable (bundled via `@fontsource-variable/geist`). Do not switch fonts.
- Light theme only. No dark mode.
- Routing: `react-router` with `createHashRouter` (Electron loads from disk). Routes are defined in `src/renderer/src/app/router.tsx`; sidebar links come from `components/layout/nav-config.ts`. To add a page: create `app/pages/<Name>Page.tsx`, add a route in `router.tsx`, add a nav item in `nav-config.ts`.
- The user adds the shadcn sidebar themselves; do not generate it unless asked.

## UI and design tokens

- **Always use the shadcn primitives in `src/renderer/src/components/ui`.** A button is `Button`, a table is `Table`, an input is `Input`, a card is `Card`, and so on. Do not hand-roll raw `<button>`, `<table>`, `<input>` or styled divs that imitate them. If a primitive is missing, add it with `npx shadcn@latest add <name>` (then replace any lucide icons with `reicon-react`).
- Feature code only references these primitives; it does not restyle them with one-off colours.
- **No hard-coded colours or design values in app code.** No hex, rgb, hsl or oklch literals, no arbitrary values like `bg-[#fff]` or `text-[13px]`, and no raw palette classes like `bg-blue-600`. Use semantic token classes only (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, `rounded-lg`, ...).
- **All tokens live in `src/renderer/src/assets/index.css`** (`:root` and `@theme inline`). Changing a token there, for example `--primary`, must restyle the whole app. If a new colour, radius, shadow or font is needed, add it as a token there first, then reference it.

## File structure (src/renderer/src)

- `components/ui/`: shadcn primitives only.
- `components/layout/`: app-wide shell pieces (sidebar, navbar, layout, nav config).
- `features/<name>/`: one folder per feature (products, customers, sales, ...). Feature-specific components go in `features/<name>/components/`, with the feature's hooks, types and logic beside them. No pages here.
- `app/`: app wiring: the router (`router.tsx`) and the route screens in `app/pages/`. Pages are thin: they compose components from features and `components/`. Pages never live in `features/`. `hooks/` and `lib/`: shared hooks and utilities.

## Visual direction

The design tokens in `index.css` stay as they are; do not change them unless asked. The reference screenshot is for layout only: a rounded grey sidebar (search at the top, small group labels, icon plus label items, soft pill on the active item) beside a rounded content card (shadcn sidebar `variant="inset"`). Hierarchy comes from size and colour, never bold weight.

## Working with the user

The user is new to Electron. Do not code blindly: explain what you are doing and why (briefly, in plain words), flag Electron-specific concepts (main vs renderer process, preload, hash routing, window options) when they come up, and say what to check after each change.

## Responsive

The UI must adapt to window resizing. Use flexible layouts (flex/grid, `min-w-0`, responsive Tailwind prefixes), never fixed pixel widths for page content. The window has a minimum size set in `src/main/index.ts`.
