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
