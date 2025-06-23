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
