## Summary

• Hide Google Maps default UI controls (zoom buttons, map type controls, street view, fullscreen) for cleaner interface
• Keep map interactive for admin use with pan, zoom, and scroll gestures enabled
• Maintain locked mode for user-facing maps with all interactions disabled
• Simplified control configuration for consistent behavior across interactive modes

## Directory tree

- ✏️ src/lib/map/google/GoogleMapsProvider.ts
- ✏️ CHANGELOG.md

## File contents

**`src/lib/map/google/GoogleMapsProvider.ts`**

```typescript
import { Loader } from '@googlemaps/js-api-loader';
import type { MapProvider } from '../MapProvider';

export default class GoogleMapsProvider implements MapProvider {
  private map: google.maps.Map | null = null;

  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
    });
  }

  async init(
    container: HTMLElement,
    center: { lat: number; lng: number },
    zoom: number,
    opts: { interactive: boolean } = { interactive: false }
  ): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'test') {
        // Skip real loader in Jest
        this.map = new google.maps.Map(container, { center, zoom });
        return;
      }

      await this.loader.load();

      const common = { center, zoom, mapTypeId: google.maps.MapTypeId.ROADMAP };

      const locked = {
        gestureHandling: 'none',
        draggable: false,
        scrollwheel: false,
        disableDefaultUI: true,      // hide all controls
        clickableIcons: false,
      };

      const free = {
        gestureHandling: 'auto',
        draggable: true,
        scrollwheel: true,
        disableDefaultUI: true,      // hide controls but keep gestures
        zoomControl: false,          // redundant when disableDefaultUI true
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      };

      this.map = new google.maps.Map(container, {
        ...common,
        ...(opts.interactive ? free : locked),
      });

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Google Maps initialized');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize Google Maps:', error);
      throw error;
    }
  }

  setCenter(center: { lat: number; lng: number }): void {
    if (this.map) {
      this.map.setCenter(center);
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  destroy(): void {
    this.map = null;
  }
}
```

## Changes Made

### 1. Updated `locked` options (for MapWrapperUser)
- **Simplified configuration**: Removed redundant options like `disableDoubleClickZoom`, `keyboardShortcuts`
- **Clean UI**: `disableDefaultUI: true` hides all Google controls
- **No interactions**: `gestureHandling: 'none'`, `draggable: false`, `scrollwheel: false`
- **No clickable icons**: `clickableIcons: false` prevents POI interactions
- **Removed styles**: Eliminated custom label hiding styles for cleaner code

### 2. Updated `free` options (for MapWrapperAdmin)
- **Interactive gestures**: `gestureHandling: 'auto'`, `draggable: true`, `scrollwheel: true`
- **Hidden controls**: `disableDefaultUI: true` removes all Google UI elements
- **Explicit control disabling**: Added redundant but explicit control disabling for clarity:
  - `zoomControl: false`
  - `mapTypeControl: false` 
  - `streetViewControl: false`
  - `fullscreenControl: false`
- **No clickable icons**: `clickableIcons: false` maintains clean interaction model

### 3. Benefits
- **Clean interface**: No Google controls visible in either mode
- **Maintained functionality**: Admin maps remain fully interactive (pan, zoom, scroll)
- **Consistent behavior**: User maps remain locked as intended
- **Future-ready**: Easy to add custom zoom controls later if needed
- **Simplified code**: Removed unnecessary options and styling overrides

## Usage

- **MapWrapperAdmin**: Uses `{ interactive: true }` → gets `free` options with hidden controls but full interactivity
- **MapWrapperUser**: Uses default `{ interactive: false }` → gets `locked` options with no controls and no interactions
- **Custom controls**: Can be added later using `map.setZoom(map.getZoom() + 1)` with custom Tailwind buttons

## Files Modified

- `src/lib/map/google/GoogleMapsProvider.ts`: Updated option presets to hide Google default UI while maintaining interactive functionality
