## Summary

• Added interactive parameter to GoogleMapsProvider to enable pan/zoom for back-office maps
• Updated MapProviderManager to pass interactive option
• MapWrapperAdmin now uses interactive:true, MapWrapperUser uses interactive:false (default)
• PlaceSearch component can now properly pan and zoom the admin map

## Directory tree

- ✏️ src/lib/map/google/GoogleMapsProvider.ts
- ✏️ src/lib/map/MapProvider.ts
- ✏️ src/lib/map/index.ts
- ✏️ src/components/MapWrapperAdmin.tsx
- ✏️ src/components/MapWrapperUser.tsx
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
        scrollwheel: false,
        draggable: false,
        disableDoubleClickZoom: true,
        zoomControl: false,
        clickableIcons: false,
        keyboardShortcuts: false,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      };

      const free = {
        gestureHandling: 'auto',
        scrollwheel: true,
        draggable: true,
        disableDoubleClickZoom: false,
        zoomControl: true,
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

**`src/lib/map/MapProvider.ts`**

```typescript
export interface MapProvider {
  init(container: HTMLElement, center: { lat: number; lng: number }, zoom: number, opts?: { interactive: boolean }): Promise<void>;
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  destroy(): void;
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  provider: 'google' | 'mapbox';
}
```

**`src/lib/map/index.ts`**

```typescript
import GoogleMapsProvider from './google/GoogleMapsProvider';
import type { MapProvider } from './MapProvider';

export class MapProviderManager {
  private currentProvider: MapProvider | null = null;

  private container: HTMLElement | null = null;

  private currentConfig: { center: { lat: number; lng: number }; zoom: number } | null = null;

  async switch(
    providerType: 'google' | 'mapbox',
    container: HTMLElement,
    center: { lat: number; lng: number },
    zoom: number,
    opts?: { interactive: boolean }
  ): Promise<void> {
    // Destroy current provider if exists
    if (this.currentProvider) {
      this.currentProvider.destroy();
    }

    // Store container and config for potential re-use
    this.container = container;
    this.currentConfig = { center, zoom };

    // Create new provider based on type
    switch (providerType) {
      case 'google':
        this.currentProvider = new GoogleMapsProvider();
        break;
      case 'mapbox':
        // Placeholder for Phase 3
        throw new Error('Mapbox provider not implemented yet');
      default:
        throw new Error(`Unknown provider type: ${providerType}`);
    }

    // Initialize the new provider
    await this.currentProvider.init(container, center, zoom, opts);
  }

  getCurrentProvider(): MapProvider | null {
    return this.currentProvider;
  }

  destroy(): void {
    if (this.currentProvider) {
      this.currentProvider.destroy();
      this.currentProvider = null;
    }
    this.container = null;
    this.currentConfig = null;
  }
}

// Singleton instance
export const mapProviderManager = new MapProviderManager();
```

**`src/components/MapWrapperAdmin.tsx`**

```typescript
// ...existing imports...

export default function MapWrapperAdmin() {
  // ...existing code...

  // Initial map setup
  useEffect(() => {
    if (!mapRef.current || didInit.current) {
      return undefined;
    }

    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom, { interactive: true });
        currentProvider.current = provider;
        didInit.current = true;

        // Add click handler for admin (back-office)
        const currentMapProvider = mapProviderManager.getCurrentProvider();
        if (currentMapProvider && 'map' in currentMapProvider) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const googleMap = (currentMapProvider as any).map;
          if (googleMap) {
            google.maps.event.addListener(
              googleMap,
              'click',
              (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                  setClickPosition({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  });
                  setIsModalOpen(true);
                }
              }
            );
          }
        }

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('admin map initialised');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize admin map:', error);
      }
    };

    initMap();
    // ...existing cleanup...
  }, []);

  // Handle provider changes
  useEffect(() => {
    if (!didInit.current || !mapRef.current || currentProvider.current === provider) {
      return;
    }

    const switchProvider = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom, { interactive: true });
        currentProvider.current = provider;

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`admin switched to ${provider} provider`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to switch map provider:', error);
      }
    };

    switchProvider();
  }, [provider, center, zoom]);

  // ...rest of component...
}
```

**`src/components/MapWrapperUser.tsx`**

```typescript
// ...existing imports...

export default function MapWrapperUser() {
  // ...existing code...

  // Initial map setup
  useEffect(() => {
    if (!mapRef.current || didInit.current) {
      return undefined;
    }

    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom);
        currentProvider.current = provider;
        didInit.current = true;

        // Configure map for user (front-office) - locked by default

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('user map initialised');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize user map:', error);
      }
    };

    initMap();
    // ...existing cleanup...
  }, []);

  // Handle provider changes
  useEffect(() => {
    if (!didInit.current || !mapRef.current || currentProvider.current === provider) {
      return;
    }

    const switchProvider = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom);
        currentProvider.current = provider;

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`user switched to ${provider} provider`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to switch map provider:', error);
      }
    };

    switchProvider();
  }, [provider, center, zoom]);

  // ...rest of component...
}
```
