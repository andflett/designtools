# Distributing the DesignTools Desktop App

This guide walks you through everything needed to build, sign, notarize, and distribute the Tauri desktop app — including the Apple-specific steps for your Developer account. Follow it top to bottom the first time; subsequent releases only need the build + upload steps.

---

## Prerequisites

Install these before anything else.

### Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
After installing, restart your terminal and verify: `rustc --version`

### Node.js 18+
Download from nodejs.org or use nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

### Xcode Command Line Tools (macOS)
```bash
xcode-select --install
```
A dialog will appear — click Install. This installs the C compiler and signing tools Tauri needs.

---

## Step 1: Register a GitHub OAuth App

The app uses GitHub's Device Flow to let designers sign in. You need an OAuth App registered to your GitHub account.

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: DesignTools
   - **Homepage URL**: `https://designsurface.dev`
   - **Authorization callback URL**: `https://designsurface.dev` (device flow doesn't use this, but GitHub requires it)
3. Click **Register application**
4. On the next screen, click **Enable Device Flow** (it's a button in the middle of the page)
5. Copy the **Client ID** — it looks like `Iv1.a1b2c3d4e5f6g7h8`
6. Do **not** generate a client secret — device flow doesn't need one

You'll use this `Client ID` as `GITHUB_CLIENT_ID` when building.

---

## Step 2: Generate App Icons

Tauri needs icons in many sizes and formats. Start from a single high-resolution PNG (at least 1024×1024, ideally with transparency).

From inside `packages/surface-app/`:
```bash
npx tauri icon path/to/your-icon.png
```

This writes all the required files into `src-tauri/icons/` automatically. Commit them.

---

## Step 3: macOS Code Signing

Unsigned macOS apps trigger a Gatekeeper warning ("App can't be opened because it's from an unidentified developer"). Signing with your Developer ID certificate makes the app trusted.

### 3a. Get a Developer ID Application certificate

1. Log in to **developer.apple.com → Certificates, Identifiers & Profiles**
2. Click the **+** button next to Certificates
3. Under "Software", select **Developer ID Application** → Continue
4. Follow the prompts to generate a Certificate Signing Request (CSR) from Keychain Access:
   - Open **Keychain Access** (search in Spotlight)
   - Menu → **Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority**
   - Enter your email, name, select "Saved to disk" → Continue → save the `.certSigningRequest` file
5. Upload the `.certSigningRequest` file on the developer.apple.com page → Continue → Download
6. Double-click the downloaded `.cer` file to install it into your Keychain

### 3b. Find your signing identity

```bash
security find-identity -v -p codesigning
```

You'll see something like:
```
1) AABBCC1122334455AABBCC1122334455AABBCC11 "Developer ID Application: Andrew Flett (XXXXXXXXXX)"
```

Note the full string in quotes — that's your `APPLE_SIGNING_IDENTITY`.

### 3c. Set up notarization

Apple requires apps distributed outside the App Store to be **notarized** — Apple scans the binary server-side and stamps it as safe. This takes 1–5 minutes per build.

**Get an App-Specific Password:**
1. Go to **appleid.apple.com → Sign-In and Security → App-Specific Passwords**
2. Click **+**, name it "Tauri notarization", generate it
3. Copy the password (format: `xxxx-xxxx-xxxx-xxxx`) — you won't see it again

**Find your Team ID:**
- It's the 10-character string in parentheses in your signing identity: `"Developer ID Application: Andrew Flett (XXXXXXXXXX)"`
- Or check developer.apple.com → Membership Details → Team ID

### 3d. Configure tauri.conf.json for signing

Edit `packages/surface-app/src-tauri/tauri.conf.json` and add signing config under `bundle`:

```json
"bundle": {
  "active": true,
  "targets": "all",
  "identifier": "cc.flett.designtools",
  "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"],
  "macOS": {
    "minimumSystemVersion": "12.0",
    "signingIdentity": null,
    "hardened_runtime": true,
    "entitlements": "entitlements.plist"
  }
}
```

Leave `signingIdentity` as `null` — pass it via environment variable at build time (safer than hardcoding).

**Create `packages/surface-app/src-tauri/entitlements.plist`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
</dict>
</plist>
```

---

## Step 4: Build the app

From the repo root:

```bash
cd packages/surface-app

GITHUB_CLIENT_ID="Iv1.your-client-id-here" \
APPLE_SIGNING_IDENTITY="Developer ID Application: Andrew Flett (XXXXXXXXXX)" \
APPLE_ID="your@apple.com" \
APPLE_PASSWORD="xxxx-xxxx-xxxx-xxxx" \
APPLE_TEAM_ID="XXXXXXXXXX" \
npm run tauri build
```

This will:
1. Build the React frontend (`vite build`)
2. Compile the Rust backend (`cargo build --release`)
3. Bundle into a `.app`
4. Code sign the binary
5. Create a `.dmg` installer
6. Submit to Apple for notarization (takes 1–5 minutes)
7. Staple the notarization ticket to the `.dmg`

**Output locations** (relative to `packages/surface-app/`):
- `.app`: `src-tauri/target/release/bundle/macos/DesignTools.app`
- `.dmg`: `src-tauri/target/release/bundle/dmg/DesignTools_0.1.0_aarch64.dmg` (or `x86_64` on Intel)

### First-run troubleshooting

**"codesign failed"** — verify the identity string matches exactly what `security find-identity` returned.

**"Notarization failed"** — check the log: `xcrun notarytool log <submission-id> --apple-id your@email.com --password xxxx --team-id XXXXXXXXXX`. Common cause: app-specific password is wrong, or Team ID doesn't match.

**"cargo: command not found"** — close and reopen your terminal after installing Rust.

---

## Step 5: Release on GitHub

1. Go to **github.com/andflett/designtools → Releases → Draft a new release**
2. Create a new tag (e.g. `v0.1.0`)
3. Write release notes
4. Drag the `.dmg` file from `src-tauri/target/release/bundle/dmg/` into the assets area
5. Publish release

The download URL will be:
```
https://github.com/andflett/designtools/releases/download/v0.1.0/DesignTools_0.1.0_aarch64.dmg
```

Update this URL in the landing page download button.

---

## Step 6: Automate with GitHub Actions (optional but recommended)

Once you've confirmed the manual build works, automate it. Create `.github/workflows/release.yml`:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install frontend deps
        working-directory: packages/surface-app
        run: npm install

      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
          APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
          APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
          APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
        with:
          projectPath: packages/surface-app
          tagName: ${{ github.ref_name }}
          releaseName: 'DesignTools ${{ github.ref_name }}'
          args: --target universal-apple-darwin
```

**Setting up GitHub secrets:**

In GitHub → repo Settings → Secrets and variables → Actions, add:

| Secret | Value |
|--------|-------|
| `GITHUB_CLIENT_ID` | Your OAuth App Client ID |
| `APPLE_CERTIFICATE` | Base64-encoded `.p12` certificate (see below) |
| `APPLE_CERTIFICATE_PASSWORD` | Password you set when exporting the `.p12` |
| `APPLE_SIGNING_IDENTITY` | Full identity string from `security find-identity` |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_PASSWORD` | App-specific password |
| `APPLE_TEAM_ID` | 10-character team ID |

**Exporting the certificate as base64 for CI:**

1. Open **Keychain Access**
2. Find "Developer ID Application: Andrew Flett" under My Certificates
3. Right-click → Export → save as `certificate.p12`, set a password
4. Base64-encode it:
   ```bash
   base64 -i certificate.p12 | pbcopy
   ```
5. Paste the clipboard contents as the `APPLE_CERTIFICATE` secret

**Universal binary** (runs natively on both Apple Silicon and Intel):
```bash
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin
# Then build with:
npm run tauri build -- --target universal-apple-darwin
```

---

## Windows

Windows signing requires an EV (Extended Validation) code signing certificate from a third-party CA (DigiCert, Sectigo, etc.) — roughly $400/year. Without it, SmartScreen will show a warning for 30+ days until enough users have downloaded and "trusted" the binary.

To build unsigned on Windows (fine for testing):
```bash
GITHUB_CLIENT_ID="Iv1.xxx" npm run tauri build
```
Output: `src-tauri/target/release/bundle/msi/DesignTools_0.1.0_x64_en-US.msi`

Windows CI signing is documented at: https://tauri.app/distribute/sign/windows/

---

## Linux

No code signing required. Tauri produces `.deb` (Debian/Ubuntu) and `.AppImage` (universal).

```bash
GITHUB_CLIENT_ID="Iv1.xxx" npm run tauri build
```

Note: Linux builds must run on Linux (or a Linux container). The GitHub Actions workflow can add a `ubuntu-latest` runner job.

---

## Version bumping

Before each release, update the version in two places:
- `packages/surface-app/package.json` → `"version": "0.2.0"`
- `packages/surface-app/src-tauri/tauri.conf.json` → `"version": "0.2.0"`

They must match.

---

## Quick reference — environment variables

| Variable | Where to get it |
|----------|----------------|
| `GITHUB_CLIENT_ID` | GitHub → Settings → Developer settings → OAuth Apps → your app |
| `APPLE_SIGNING_IDENTITY` | `security find-identity -v -p codesigning` |
| `APPLE_ID` | Your Apple ID email address |
| `APPLE_PASSWORD` | appleid.apple.com → App-Specific Passwords |
| `APPLE_TEAM_ID` | developer.apple.com → Membership → Team ID |
