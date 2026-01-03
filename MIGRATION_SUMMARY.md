# Migration Summary: NPM Package → CDN

This document shows the before and after comparison of converting from npm package to CDN integration.

## Before (NPM Package)

### package.json

```json
{
  "devDependencies": {
    "medos-sdk": "file:../medos-sdk-js"
  }
}
```

### index.html

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dr. Ralph's Clinic</title>
</head>
```

### Component (Before)

```tsx
import {
  AppointmentCalender,
  defaultTheme,
  MedosThemeProvider,
  MedosClient,
} from "medos-sdk";

MedosClient.init({
  apiKey: "mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98",
});

const Appointments = () => {
  return (
    <div>
      <MedosThemeProvider theme={defaultTheme}>
        <AppointmentCalender onError={(err) => console.log(err)} />
      </MedosThemeProvider>
    </div>
  );
};
```

---

## After (CDN)

### package.json

```json
{
  "devDependencies": {
    // medos-sdk removed - loaded from CDN
  }
}
```

### index.html

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dr. Ralph's Clinic</title>

  <!-- MedOS SDK CDN -->
  <link rel="stylesheet" href="https://widgets.medos.one/v1/appointments.css" />
  <script src="https://widgets.medos.one/v1/appointments.js"></script>
</head>
```

### Component (After)

```tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    MedosAppointmentCalendar?: {
      init: (options: {
        containerId: string;
        apiKey?: string;
        onError?: (error: Error) => void;
        onSuccess?: () => void;
      }) => void;
    };
  }
}

const Appointments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const initWidget = () => {
      if (
        window.MedosAppointmentCalendar &&
        containerRef.current &&
        !initialized.current
      ) {
        window.MedosAppointmentCalendar.init({
          containerId: "appointment-widget-container",
          apiKey:
            "mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98",
          onError: (err) => console.error(err),
          onSuccess: () => console.log("Success!"),
        });
        initialized.current = true;
      }
    };

    if (window.MedosAppointmentCalendar) {
      initWidget();
    } else {
      const checkInterval = setInterval(() => {
        if (window.MedosAppointmentCalendar) {
          initWidget();
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div>
      <div
        id="appointment-widget-container"
        ref={containerRef}
        className="min-h-[550px]"
      />
    </div>
  );
};
```

---

## Key Differences

| Aspect             | NPM Package                             | CDN                          |
| ------------------ | --------------------------------------- | ---------------------------- |
| **Installation**   | `npm install medos-sdk`                 | Add `<script>` tag to HTML   |
| **Import**         | `import { Component } from "medos-sdk"` | Use `window.MedosComponent`  |
| **Updates**        | Requires `npm update` and rebuild       | Automatic from CDN           |
| **Bundle Size**    | Increases app bundle                    | External, cached by browser  |
| **Initialization** | Direct component usage                  | Imperative `.init()` call    |
| **Theme Provider** | `<MedosThemeProvider>` wrapper needed   | Handled by widget internally |
| **TypeScript**     | Types included in package               | Manual window declarations   |

---

## Migration Checklist

✅ Add CDN links to `index.html`  
✅ Remove `medos-sdk` from package.json  
✅ Replace component imports with window globals  
✅ Add TypeScript declarations for window objects  
✅ Use `useEffect` for widget initialization  
✅ Prevent duplicate initialization with refs  
✅ Handle async SDK loading with polling  
✅ Update all affected components  
✅ Test all widget functionality  
✅ Update documentation

---

## Files Modified

- `index.html` - Added CDN script tags
- `package.json` - Removed medos-sdk dependency
- `src/pages/Index.tsx` - Converted to CDN
- `src/pages/Appointments.tsx` - Converted to CDN
- `src/pages/Enquiry.tsx` - Converted to CDN
- `src/pages/QueueBooking.tsx` - Converted to CDN
- `README.md` - Updated with MedOS SDK info
- `CDN_INTEGRATION.md` - Created (new documentation)
- `MIGRATION_SUMMARY.md` - Created (this file)
