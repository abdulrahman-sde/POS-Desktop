# Stockwise

Point of sale and customer accounts for a mobile parts and accessories shop.
Electron + React + TypeScript. For now it runs on demo data kept in memory (it resets when the app closes).

## Run while developing

```bash
npm install
npm run dev
```

## Make the Windows installer

```bash
npm run build:win
```

The installer is created in `dist/`:

- `stockwise-0.9.0-setup.exe`: the installer to give to the shop
- `win-unpacked/`: the same app as a plain folder (run `stockwise.exe` inside it, no install needed)

### Test it on Windows

1. Copy `stockwise-0.9.0-setup.exe` to a Windows 10 or 11 computer (USB stick, cloud drive).
2. Double-click it. The app is not code-signed yet, so Windows SmartScreen may say "Windows protected your PC":
   click **More info**, then **Run anyway**. This is normal for an unsigned app.
3. Choose the install folder, finish, and open **Stockwise** from the desktop shortcut.

Things to check on Windows: the sidebar and all screens look right, a sale can be created, the invoice prints
(Print button), the WhatsApp button opens WhatsApp, and resizing or maximising the window works.

### Other builds

```bash
npm run build:mac     # macOS
npm run build:unpack  # unpacked app for the computer you are on
```
