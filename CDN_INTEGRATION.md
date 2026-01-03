# MedOS SDK CDN Integration Guide

This document explains how the Dr. Ralph's Appointment application has been converted to use the MedOS SDK via CDN instead of the npm package.

## Overview

The application now loads the MedOS SDK widgets from the **widgets.medos.one** CDN, eliminating the need for package installation and reducing bundle size.

## Changes Made

### 1. HTML Head Updates (`index.html`)

Added CDN script and stylesheet links:

```html
<!-- MedOS SDK CDN -->
<link rel="stylesheet" href="https://widgets.medos.one/v1/appointments.css" />
<script src="https://widgets.medos.one/v1/appointments.js"></script>
```

### 2. Component Updates

All components that previously imported from `medos-sdk` have been updated to use the global window objects:

#### Available Global APIs

- `window.MedosAppointmentCalendar` - Appointment booking widget
- `window.MedosEnquiryForm` - Enquiry form widget  
- `window.MedosQueueBooking` - Queue booking widget (if available)

#### Pattern Used

Each component now follows this pattern:

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

const MyComponent = () => {
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
          containerId: "widget-container-id",
          apiKey: "your-api-key",
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

  return <div id="widget-container-id" ref={containerRef} />;
};
```

### 3. Removed Dependencies

- Removed `medos-sdk` from `package.json` devDependencies
- Removed all imports from `"medos-sdk"`
- No longer need `MedosThemeProvider` or `defaultTheme` imports

### 4. Updated Components

The following components have been converted:

- **Index.tsx** - Homepage with both appointment and enquiry widgets
- **Appointments.tsx** - Dedicated appointment booking page
- **Enquiry.tsx** - Dedicated enquiry form page
- **QueueBooking.tsx** - Queue booking page

## Benefits

✅ **Smaller Bundle Size** - SDK code is loaded from CDN, not bundled with app  
✅ **Faster Updates** - SDK updates are immediate without rebuilding  
✅ **Better Caching** - CDN caching improves load times  
✅ **Simpler Dependencies** - No package version management needed  
✅ **Cross-Framework** - Same CDN works for vanilla JS, React, Vue, etc.

## API Key

The application uses this API key for all widgets:
```
mk_bf42d16d3fd0c7756dfa3b783061df98bf42d16d3fd0c7756dfa3b783061df98
```

## Widget Initialization Options

### Appointment Calendar

```typescript
window.MedosAppointmentCalendar.init({
  containerId: "appointment-widget",
  apiKey: "your-api-key",
  onError: (error) => void,
  onSuccess: () => void,
});
```

### Enquiry Form

```typescript
window.MedosEnquiryForm.init({
  containerId: "enquiry-widget",
  apiKey: "your-api-key",
  onError: (error) => void,
  onSuccess: () => void,
});
```

### Queue Booking

```typescript
window.MedosQueueBooking.init({
  containerId: "queue-widget",
  apiKey: "your-api-key",
  onError: (error) => void,
  onSuccess: (token) => void,
  initialQueueStats?: {
    currentPatientCount: number;
    estimatedWaitTime: number;
    queueOpenTime: string;
    queueCloseTime: string;
    isQueueOpen: boolean;
  },
});
```

## Development

To run the application:

```bash
npm run dev
```

The widgets will load from the CDN automatically when the pages load.

## Production Build

```bash
npm run build
```

The production build will reference the CDN URLs for the MedOS SDK.

## Troubleshooting

### Widgets Not Loading

1. Check browser console for errors
2. Verify CDN URLs are accessible: https://widgets.medos.one/v1/appointments.js
3. Ensure unique container IDs for each widget instance
4. Check that the SDK has finished loading before initialization

### TypeScript Errors

The components include proper TypeScript declarations for the window globals. If you see errors, ensure the declarations are present at the top of the component file.

## Reference

For more examples and integration patterns, see:
- `medos-sdk-js/examples/cdn-frameworks/react/index.html`
- `medos-sdk-js/examples/cdn-appointment-booking.html`
- `medos-sdk-js/examples/enquiry-form.html`
