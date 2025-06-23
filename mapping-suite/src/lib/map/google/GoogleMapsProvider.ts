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

      const common = { 
        center, 
        zoom, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] }
        ]
      };

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
