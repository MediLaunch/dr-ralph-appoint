# Local Development Setup

## MedOS SDK Integration

This project uses the MedOS SDK widgets for healthcare functionality. During development, the widgets are loaded from **local files** in the `public/` folder rather than a CDN.

## Setup

### 1. Build the MedOS SDK (First Time Only)

If you haven't built the medos-sdk-js project yet:

```powershell
cd ..\medos-sdk-js
npm install
npm run build
```

### 2. Copy SDK Files

Run the update script to copy the latest SDK build:

```powershell
.\update-medos-sdk.ps1
```

Or manually copy the files:

```powershell
Copy-Item "..\medos-sdk-js\dist\vanilla\widget.js" ".\public\medos-sdk.js"
Copy-Item "..\medos-sdk-js\dist\vanilla\widget.css" ".\public\medos-sdk.css"
```

### 3. Start Development Server

```bash
npm run dev
```

The application will now load the MedOS SDK widgets from `/medos-sdk.js` and `/medos-sdk.css`.

## File Structure

```
dr-ralph-appoint/
├── public/
│   ├── medos-sdk.js      # Widget functionality (copied from SDK)
│   ├── medos-sdk.css     # Widget styles (copied from SDK)
│   └── ...
├── index.html             # References local SDK files
└── update-medos-sdk.ps1   # Script to update SDK files
```

## How It Works

1. **index.html** loads the SDK from local files:

   ```html
   <link rel="stylesheet" href="/medos-sdk.css" />
   <script src="/medos-sdk.js"></script>
   ```

2. **Components** initialize widgets via global window objects:

   - `window.MedosAppointmentCalendar`
   - `window.MedosEnquiryForm`
   - `window.MedosQueueBooking`

3. **Vite** serves files from `public/` at the root path

## Updating the SDK

When the medos-sdk-js project is updated:

1. Rebuild the SDK:

   ```bash
   cd ..\medos-sdk-js
   npm run build
   ```

2. Run the update script:

   ```bash
   cd ..\dr-ralph-appoint
   .\update-medos-sdk.ps1
   ```

3. Refresh your browser (Vite will hot-reload automatically)

## Production Deployment

For production, you have two options:

### Option 1: Use CDN (Recommended)

Update `index.html` to use the production CDN:

```html
<link rel="stylesheet" href="https://widgets.medos.one/v1/appointments.css" />
<script src="https://widgets.medos.one/v1/appointments.js"></script>
```

### Option 2: Bundle Local Files

Keep the local files and deploy them with your application. They will be copied to the `dist/` folder during build.

## Troubleshooting

### Widgets Not Appearing

1. **Check browser console** for errors
2. **Verify files exist**:
   ```powershell
   Test-Path .\public\medos-sdk.js
   Test-Path .\public\medos-sdk.css
   ```
3. **Confirm SDK is loaded**:

   - Open browser DevTools Console
   - Type: `window.MedosAppointmentCalendar`
   - Should return an object, not `undefined`

4. **Re-copy SDK files**:
   ```powershell
   .\update-medos-sdk.ps1
   ```

### TypeScript Errors

The components include window global declarations. If you see TypeScript errors, ensure the declarations in each component match the SDK's API.

### Stale SDK

If you made changes to the SDK but don't see them:

1. Rebuild the SDK
2. Run the update script
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Development vs Production

| Environment     | SDK Source                   | Configuration     |
| --------------- | ---------------------------- | ----------------- |
| **Development** | Local files (`/medos-sdk.*`) | Current setup     |
| **Production**  | CDN or bundled files         | Update index.html |

The local development setup allows you to:

- ✅ Test SDK changes immediately
- ✅ Work offline
- ✅ Debug SDK issues
- ✅ Develop both projects simultaneously

## API Key

The application uses this API key:

```
mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98
```

This key is configured in each component's initialization code.
