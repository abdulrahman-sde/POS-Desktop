# Babar Trades

Electron + React 19 + TypeScript desktop POS/accounting app (electron-vite, Tailwind v4, shadcn `base-nova`).

**Business domain: a mobile phone parts and accessories shop** (screens, batteries, chargers and cables, charging ports, back covers, cameras, speakers, cases, earphones, power banks, repair tools). Customers are mobile shops and repair technicians. All demo/mock data, labels and placeholder text must fit this domain (brands like Samsung/Apple/Xiaomi, phone models, quality grades Original/OEM/A-grade copy/Refurbished, warranty). Never use grocery or generic-store examples.

## Rules

- **No rings or glows.** Never use `ring-*` utilities (focus, selected, invalid or decorative). A focused or selected thing changes its **border** colour only; a card or pop-up edge is a normal `border`. Rings are drawn outside the box, so scrolling areas cut them off. The shadcn primitives in `components/ui` have had their rings removed: if you add one with `npx shadcn@latest add`, strip the `ring` classes from it.
- **Never use bold fonts.** No `font-bold`, `font-semibold`, `font-extrabold`, `font-black` (or `<b>`/`<strong>`), including inside shadcn components. Create hierarchy with size, colour and spacing instead.
- **Icons: use `reicon-react` only.** Never use `lucide-react` (removed from the project). If a shadcn component pulls in lucide icons, replace them with reicon-react equivalents.
- Fonts: Geist Variable (bundled via `@fontsource-variable/geist`). Do not switch fonts.
- Light theme only. No dark mode. This is enforced in two places: `@custom-variant dark (&:is(.dark *))` in `index.css` (so shadcn's `dark:` classes never follow the computer's dark mode) and `nativeTheme.themeSource = 'light'` in `src/main/index.ts`. Test UI changes with the computer in dark mode too.
- **Never cut text off with "...".** No `truncate`, `text-ellipsis` or `line-clamp` on numbers, names or labels. Let text wrap, or keep numbers on one line and let the layout move (see `StatCard`). The only exception is the sidebar menu labels.
- Routing: `react-router` with `createHashRouter` (Electron loads from disk). Routes are defined in `src/renderer/src/app/router.tsx`; sidebar links come from `components/layout/nav-config.ts`. To add a page: create `app/pages/<Name>Page.tsx`, add a route in `router.tsx`, add a nav item in `nav-config.ts`.
- The user adds the shadcn sidebar themselves; do not generate it unless asked.

## UI and design tokens

- **Always use the shadcn primitives in `src/renderer/src/components/ui`.** A button is `Button`, a table is `Table`, an input is `Input`, a card is `Card`, and so on. Do not hand-roll raw `<button>`, `<table>`, `<input>` or styled divs that imitate them. If a primitive is missing, add it with `npx shadcn@latest add <name>` (then replace any lucide icons with `reicon-react`).
- Feature code only references these primitives; it does not restyle them with one-off colours.
- **No hard-coded colours or design values in app code.** No hex, rgb, hsl or oklch literals, no arbitrary values like `bg-[#fff]` or `text-[13px]`, and no raw palette classes like `bg-blue-600`. Use semantic token classes only (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, `rounded-lg`, ...).
- **All tokens live in `src/renderer/src/assets/index.css`** (`:root` and `@theme inline`). Changing a token there, for example `--primary`, must restyle the whole app. If a new colour, radius, shadow or font is needed, add it as a token there first, then reference it.

## File structure (src/renderer/src)

- `components/ui/`: shadcn primitives only.
- `components/layout/`: app shell (sidebar, layout, nav config).
- `components/shared/`: components used by MORE THAN ONE module (page-header, stat-card, empty-state, form-field, option-select, search-field, status badges, record-payment-dialog, whatsapp-button...). If something is used by only one feature, it belongs in that feature instead.
- `features/<name>/`: one folder per feature (products, categories, customers, sales, invoices, payments, reports, settings, dashboard). Inside: `api/` (calls and query keys), `components/` (feature-only UI), `hooks/` (feature hooks), `types.ts`, `constants.ts`, `utils.ts`. No pages here.
- `app/`: `router.tsx`, `pages/` (thin route screens that compose feature and shared components), `providers/` (the Buy Stock draft and the invoice viewer; the query client is wired in `App.tsx`).
- `lib/`: pure helpers (format, whatsapp). `hooks/`: hooks shared across features.

## Data and backend

The database is SQLite (`better-sqlite3` + Drizzle ORM + Zod), owned by the Electron main process. It starts EMPTY (no demo data). Money is whole Pakistani rupees (PKR), stored as integers, no decimals. The file is `babar.db` in `app.getPath('userData')`.

One feature goes through these layers, in order:
- `src/shared/<feature>/`: `table.ts` (Drizzle table, RELATIVE imports only because drizzle-kit reads it), `schema.ts` (Zod rules with the plain-language messages, used by the forms AND the backend), `types.ts` (inferred types). Run `npm run db:generate` after changing a table; the generated .sql files in `src/main/db/migrations` run when the app starts.
- `src/main/modules/<feature>/`: `*.ipc.ts` (routes, input checked with the schema), `*.service.ts` (rules that need the database, multi-step writes inside one transaction, `UserError` for messages the owner can read), `*.queries.ts` (Drizzle only, no rules).
- `src/preload/modules/<feature>.ts`: the list of calls the screen may make, published as `window.api.<feature>.*`.
- `features/<feature>/api/`: `<feature>.api.ts` only calls `window.api` and returns the raw `{ ok, data } | { ok: false, message }` answer; `<feature>.keys.ts` holds the React Query keys.
- `features/<feature>/hooks/`: `useX` (read, via `useApiQuery`) and mutation hooks (via `useApiMutation`, which unwraps the answer). A write hook invalidates every key whose data it changed. Form logic (state, validation, submit) lives in a hook too, so components only render.

Nothing is ever really deleted. A delete sets `deletedAt` on the row (customers, suppliers, categories): lists hide it, old invoices, bills and payments still show its name (use `allCustomers`-style lookups for names), and the same name can be used again (partial unique index `where deleted_at is null`). A customer who still owes money cannot be deleted (the backend works it out from orders and payments); a supplier you still owe cannot be deleted either (the backend works it out from bills and payments); a category only when it has no products.

Components never fetch or save directly. Every module is in the database: categories, products, customers, suppliers, sales (orders and their items), customer payments, purchases (supplier bills), supplier payments and shop settings. The old in-memory `useData()` provider is gone. Shop settings are one row in the `settings` table (defaults come from `shared/settings/constants.ts` until the owner saves).

## Code style

- No inline types in components: prop and hook-result types live in the feature's `types.ts`. Static data lives in the feature's `constants.ts`.
- Few comments, only where the reason is not obvious.
- Dates use `date-fns` (helpers in `lib/format.ts`).
- A product's category is stored by id (`categoryId`); `Product.category` is the name looked up for display. Product names are unique ignoring capitals. The item code is made automatically (ITM-0001).

## Plain language (the shop owner is not technical)

Write every label, hint, button and message in simple everyday words. No accounting or software jargon. Use these words consistently:
- "Owes you" / "Nothing due" (never "balance", "outstanding", "settled", "receivable")
- "Not paid" / "Part paid" / "Paid" for invoice status
- "Money received" (never "paid now", "advance" or "credit sale"); "Still to pay" / "Remaining to pay" (never "balance due"). The Money received field starts at 0; a walk-in customer must pay the full amount before the invoice can be created
- "Receive payment" (never "record payment"); "Cost price" for what the shop paid (the owner uses this word); "Item code" (never "SKU")
- "Sold", "Profit", "Money to collect". Keep sentences short and say what will happen ("This lowers what the customer owes you").
- Expenses are NOT part of the app for now. Do not add them unless asked. Suppliers ARE part of the app (see Suppliers).

## Charts

Charts follow the `dataviz` skill: no chart library, plain SVG, colours from tokens (`stroke-primary`, `fill-muted-foreground`, never hex), one series = no legend, 2px lines, crosshair + tooltip on hover and arrow keys, and a Table tab with the same numbers. Reports use a line chart (`features/reports/components/sales-line-chart.tsx`).

## Add product form

Keep it short. Required (red * after the label): **Product name, Category, Cost price, Quantity in shop**. Everything else is optional: Brand, Selling price, Warn me when stock is (starts at 5), Shelf. There is no quality, colour, warranty, unit, item code or barcode field: the unit is always `pcs`, the item code is made automatically, and `quality` is optional on a product (its chip only shows when set). When a product is added from inside a Buy Stock bill the form hides Quantity (the bill brings it, so it is never counted twice). Use `FormField required` for the asterisk.

## Prices

A product has two prices: **cost price** (required) and **usual selling price** (`salePrice`). If the selling price is left empty, the app sets it to the cost price plus 15% (`features/products/utils.ts`, `DEFAULT_MARKUP`). The usual selling price is only a starting point. In the New Sale cart each line has its own **Price per piece** field, which starts at the usual price and the owner can change it for that sale. The line total is quantity x price per piece (2 pieces at Rs 600 = Rs 1,200). A line priced below the cost price shows a short red warning. Changing the price in a sale never changes the product. There is no "last sold" price and no saved per-customer price. Do not add them back unless asked. Each order item saves the price it was sold at (`unitPrice`) and the cost at that time (`costPrice`), so reports stay correct if the product's prices are edited later.

## Suppliers and buying stock

A supplier belongs to a **bill**, not to a product (products have no supplier field). The shop has one main supplier for now, but the app supports many.
- **Buy stock** (`/stock/new`, `features/purchases/`) is how a supplier's bill is entered. It works like New Sale: pick the supplier, search or scan a product, type quantity and cost for each piece, type Money paid, save. Saving adds the quantities to stock and sets each product's cost price to the cost on the bill. If the product is not in the list, "Add as a new product" opens the normal product form inside the bill, and the new product lands on the bill. A product already on the bill gets +1 instead of a second line.
- **Suppliers** (`/suppliers`, `features/suppliers/`): add, edit, delete (hidden, not removed; not while you still owe them money). Supplier names are unique ignoring capitals. Shows Total bought and **You owe** per supplier, a **Pay** button (money paid later), and a Stock bills tab listing every bill.
- Money model mirrors customers: a bill stores `paid` at the time, later money is a `SupplierPayment`; `features/purchases/utils.ts` (`supplierOwed`) works out what is still owed.
- Profit and loss reporting comes later with Reports.

## Keyboard selection (New Sale tiles and Buy Stock results)

Typing in the search box selects the first match, with the same grey background as hover plus a coloured border (`selectedClasses` in `components/shared/selected-classes.ts`; never restyle it per screen). Arrow keys move the selection (Buy Stock: Up/Down through the list, ending on "Add a new product"; New Sale: Up/Down jump a row of tiles, Left/Right one tile when the text cursor is at the end). Enter adds the selected one, Esc clears. An exact barcode or item code always wins on Enter, so scanners keep working.

## Invoice import (Buy Stock)

`features/purchases/import/`. **Import invoice** (top right of Buy Stock; it becomes **Continue invoice** while one is in progress) takes the supplier's PDF and opens a full PAGE, `/stock/import` (`app/pages/ImportInvoicePage.tsx`), never a pop-up. The Buy Stock bill and the invoice being checked live in `PurchaseDraftProvider` (`app/providers/purchase-draft-*`), so leaving the page and coming back loses nothing. Both pages read them with `usePurchaseDraft()`.
- **Left:** the invoice PDF, drawn page by page with pdf.js on canvases (`pdf-panel.tsx`; no web address, because the app's CSP blocks embedding). "Hide invoice" gives the list the whole width. Zoom out / in / Fit buttons, Ctrl/Cmd + mouse wheel (or trackpad pinch) zoom, drag with the mouse to move around. On windows narrower than `lg` the PDF sits above the list.
- **Right: ONE list that is the invoice as it is.** Same order, same item numbers (the invoice's own), and a category heading (a `CategoryChip` with the item count) wherever the invoice has one. **Nothing is ever sorted, regrouped, moved or renumbered**, whatever the owner changes in a row (switching a line between existing and new keeps it exactly where it is). The heading shown is the invoice's (`row.heading`, fixed); the product's own category (`row.category`) can be changed with the details form without moving the row. A line with no heading is shown under Others; a heading you do not have yet is created when the items are added; same words in any order = same category.
- **Fixed column headings** (`sticky top-0`, so they never scroll away), **centred over their columns**: Item, Name, Quantity, Cost price, Total. There is NO heading over the match column. One line of the list (the heading line and every item) is the `import-row` grid utility in `index.css`: its columns share the width in proportion (`fr`), so extra room is spread out evenly, no single column hogs the space and the gaps between columns stay equal. Cell content is centred (numbers, total, the New tag). There is NEVER a sideways scrollbar. Every item is a white card (like the cart lines); the row being worked on keeps the selected border (`selectedClasses`) after a window closes.
- **Matched product column is short on purpose, and is the ONE place a name is deliberately shortened** (the owner asked for it, to keep the list narrow): an existing product shows the first words of its name (at most 3 words and about 18 letters, so it is always ONE line, never wrapped) as a small button in a soft green tint (`border-success/30 bg-success/10 text-success`); **hovering shows a tooltip with the full name and the stock**, and **clicking opens `matched-product-dialog.tsx`** (product name large, category chip, In stock / Cost price / Selling price tiles, what the invoice called it, **Change product**). A line that is not one of your products shows a small **New** tag in a soft, sober blue tint (`Badge variant="info"` with `bg-info/15`; never black or solid, and never styled like a button) and an **edit icon** that opens the Add product form in draft mode (filled in; Save hands the values back to the row). That form has a **"This is an existing product"** button (left of Cancel) that opens the product picker (your products by name with a plain search) and switches the line to an existing product in place. Keep this cell to the tag and one icon so it stays on one line.
- **Add new product** (bottom left, always visible) adds an empty line to type in by hand, for something the PDF reading missed. It starts under Others.
- Rows are vertically centred (`items-center`); never add per-element top padding to line things up.
- **Rows adapt to the panel's own width (container query, `@container` / `@row:`), never overflow their card.** Wide: one line per item on the `import-row` grid, with the fixed headings. The switch happens at the `--container-row` token (38rem, in `index.css`). Narrower: a two-line card (number, name and bin on the first line; quantity, cost price, total and matched product spread across the second, each with a small caption) and the fixed headings are hidden. Every cell is a caption (two-line only) above a control box of the SAME height (`Cell`), so captions, inputs, amounts and chips line up. Text sizes are fixed: row text `text-sm`, headings and captions `text-xs`.
- Every value is editable (quantity, cost price, and the name of a new product). An existing item shows the invoice's own name, which is not edited. A removed row can be undone from the toast.
- **One button at the bottom: "Add all to bill".** One click puts everything in place (existing products get the stock, new products are created with stock 0 plus the quantity on the bill). Nothing has to be confirmed row by row: it is only blocked when an item lacks a name, quantity or price.
- Footer: invoice total (and, only when it differs, what the items add up to).
- **Matching is deliberately plain: the invoice name must equal a product name, ignoring only capital letters** (`match.ts`: `sameName`, `findProductByName`; category headings are compared the same way). There is NO fuzzy matching, no word-order or typo tolerance, no "similar" or "not sure" state and no remembered wordings: an earlier version guessed and got products wrong. Anything not identical is a **New** product, and the owner switches it by hand ("This is an existing product"). Do not add guessing back unless asked.
- New products get stock 0 (the bill brings the quantity) and the 15% selling price unless details are added.
- **Parcel / shipping is skipped completely:** a heading containing parsal, parcel, shipping, freight, courier or delivery (`SKIPPED_HEADINGS` in `parse-invoice.ts`) and every line under it are dropped by the parser. They are not shown, not made into a category or a product, and nothing about them is stored (no cost, nothing in the database). The footer only says "Not added: ..." and the total check counts the skipped amount, so the invoice total still matches. Item numbers keep the invoice's own numbers, so there is a gap where a line was skipped.
- **PDF reading is real and runs on this computer** (`extract.ts` loads the file with pdf.js, `parse-invoice.ts` is a plain function that turns the page text into items). It reads the Crystal Reports "bill by category" layout: item number, name (a long name wraps onto the next line and is joined), Qty, Rate (= cost price), Amount, category headings (alone on a line, slightly larger text), and ignores the subtotal lines. It uses the printed "Bill Total". Tested on a real 5-page invoice: 169 items numbered 1..169, quantity 241 and total 439,099 all match the PDF's own figures. A PDF in another layout fails with "We could not read this invoice"; the column positions are constants at the top of `parse-invoice.ts`, the one place to adapt. The optional GPT step (only for lines the offline step could not decide; names only, never prices) is planned and not built.

## Cart lines (New Sale and Buy Stock)

Both use `components/shared/qty-price-row.tsx`: `[- qty +]  Rs [price]  line total`. Quantity is on the left. Everything updates on every keystroke (no Enter or leaving the field). Two headings sit at the top right of the list: "Sale price" (Buy Stock: "Cost price") and "Total", lined up with the price and total columns. Keep headings short and plain; the cart header has one hint line saying what can be changed. A sale or bill cannot be saved while an item has no price. Each item is its own white box (rounded, thin border) on the grey cart panel, so it is clear where one item starts and ends.

## Product tiles (New Sale)

Keep the tiles plain. Top to bottom: name (with the in-cart count), no brand line; the **Cost price** first and strongest (coin icon, larger amount, because it is the price the owner looks at most); the **Usual price** below it, small and grey so it does not pull the eye; then the **category chip** (`CategoryChip`) on the left and the stock text ("14 pcs left" / "Out of stock") on the right. No quality chip, no other icons, dots, tinted blocks or dividers. Keep `min-w-0` and wrapping so a tile never gets cut off. Component: `features/sales/components/pos-product-tile.tsx`. The tiles sit in a `product-grid` (utility in `index.css`): as many columns as fit, never narrower than the `--tile-min` token, so prices and chips are never cut off. Change `--tile-min` there, not in the component.

## Category chips

Use `components/shared/category-chip.tsx` wherever a category is shown as a chip. Each category gets its own tinted colour from the tokens `--category-1..8` in `index.css`, chosen by the category's place in the Categories list. These hues are kept away from success (green), warning (amber) and destructive (red): never use those colours for a category, and never colour a category chip with raw classes.

## Products table

The product cell is: name, then a `CategoryChip` and "Shelf A1" in small grey text. No brand or phone-model line, and no quality column.

## Checkout panel (New Sale)

Keep it small so the cart gets the room: Customer, then Discount and Money received side by side (labels on ONE line, inputs aligned, with a real outline "Full amount" button inside the Money received field), ONE hint line (the walk-in rule is said only here, never twice), the payment method row (always shown, greyed out until money is received), and a short summary (Total, Money received, Still to pay: all always shown; Subtotal and Discount only when a discount is typed). No profit row and no "Shortcut" line. **Nothing in this panel may appear, disappear or change height when a button is clicked** (clicking "Full amount" must not make anything jump), and buttons do not move when pressed. Secondary buttons use the `outline` variant, whose border is `border-input` so it is clearly visible on white and grey; never use `ghost` for a button that must look like a button.

## Customer table

One line per invoice (Bill, and the money received when buying on the SAME line) plus one line per later payment. The last column is **Total owed**: the customer's whole account after that line (goes up by the bill, down by money received). The newest line equals the "Owes you" card. The invoice status chip is the invoice's own current status (a later payment can make an old invoice Paid), which is why it can differ from Total owed on that line.

## Backup

A **Backup** button sits at the far right of the top bar (`components/layout/app-layout.tsx`) and on the Settings page. Both use the shared `hooks/use-backup.ts`. It opens the computer's Save window (`main/backup/backup.ipc.ts`) and copies the whole database with SQLite's own backup function, which gives a consistent `.db` file even while the app is running. Bringing a saved copy back is not built yet (the button is disabled).

## Categories

Product categories are NOT hard-coded. The owner manages them on the Categories screen (`/categories`, `features/categories/`): add, rename (also renames on all its products) and delete (only when it has no products). Everything that needs a category list (product form, filters, POS chips) reads it with `useCategories()`.

## Money model

Creating a sale (`sales:createOrder`) is one transaction in `sales.service.ts`: it checks the customer, the stock, the discount, that Money received is not more than the total and that a walk-in customer pays in full, makes the invoice number (INV-1001, ...), saves each item with the product's name and cost at that moment (`costPrice`) and the price sold (`unitPrice`), and lowers stock. A failed sale changes nothing. Money received later is saved as a payment (`payments:record`, whole rupees, any amount above zero: paying more than is owed is allowed). Invoice status and what a customer owes are worked out on screen (`useInvoices()`, `features/sales/utils.ts`) from orders plus payments.

Money paid while making a sale is stored on the order (`advance`). Money paid later is a `Payment`. `features/payments/utils.ts` (`buildReceipts`) merges both so the Payments page shows every rupee received. Customer balance and invoice status are computed in `features/sales/utils.ts`.

## Tables and tabs

- Tables sit in `<Card className="gap-0 px-3 py-1">` so rows have side padding. Rows are separated by a thin inset divider (`border-foreground/10`, built into the Table primitive); do not add extra borders.
- The active tab is a white raised pill on a darker track (built into the Tabs primitive).

## Chips, status colours and invoices

- Status chips use `Badge` variants only: `success`, `warning`, `destructive`, `info`, `secondary`, `outline`. Meaning: success = paid / in stock / settled, warning = partial / low stock, destructive = unpaid / out of stock / owed, info = neutral labels. Never colour a chip with raw classes.
- Tinted icon squares (stat cards) use `toneClasses` from `components/shared/stat-card.tsx`.
- Invoices are shown in a modal, never on a separate page. Open one from anywhere with `useInvoiceViewer().openInvoice(orderId)` (`app/providers/invoice-viewer-context.ts`); the single modal is `features/invoices/components/invoice-dialog.tsx`.

## Gotchas

- `reicon-react` icons cannot receive children (they set their own SVG). Never pass an icon as `render={<Icon />}` to a Base UI part; wrap it as a child instead.
- Use `<Button nativeButton={false} render={<Link to="..." />}>` for link-buttons.

## Visual direction

The design tokens in `index.css` stay as they are; do not change them unless asked. Status colours exist as tokens: `success` (green), `warning` (amber), `info` (blue-teal) and `destructive` (red), each with a `-foreground`. The reference screenshot is for layout only: a rounded grey sidebar (logo at the top, small group labels, icon plus label items, soft pill on the active item) beside a rounded content card (shadcn sidebar `variant="inset"`). Hierarchy comes from size and colour, never bold weight.

## Working with the user

The user is new to Electron. Do not code blindly: explain what you are doing and why (briefly, in plain words), flag Electron-specific concepts (main vs renderer process, preload, hash routing, window options) when they come up, and say what to check after each change.

## Responsive

The UI must adapt to window resizing. Use flexible layouts (flex/grid, `min-w-0`, responsive Tailwind prefixes), never fixed pixel widths for page content. The window has a minimum size set in `src/main/index.ts`.
