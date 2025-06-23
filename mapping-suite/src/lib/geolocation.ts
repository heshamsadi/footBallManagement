/**
 * Geolocation utility for getting user's current position
 */

export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface GeolocationOptions {
  timeout?: number;
  enableHighAccuracy?: boolean;
  maximumAge?: number;
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  timeout: 10000, // 10 seconds
  enableHighAccuracy: true,
  maximumAge: 300000, // 5 minutes
};

const FALLBACK_LOCATION: GeolocationPosition = {
  lat: 37.7749, // San Francisco
  lng: -122.4194,
};

/**
 * Get user's current location using browser geolocation API
 * Falls back to San Francisco if geolocation fails or is not available
 */
export async function getCurrentLocation(
  options: GeolocationOptions = {}
): Promise<GeolocationPosition> {
  return new Promise((resolve) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Geolocation is not supported by this browser. Using fallback location.');
      }
      resolve(FALLBACK_LOCATION);
      return;
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Geolocation error:', error.message, '. Using fallback location.');
        }
        resolve(FALLBACK_LOCATION);
      },
      {
        timeout: mergedOptions.timeout,
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        maximumAge: mergedOptions.maximumAge,
      }
    );
  });
}

/**
 * Check if geolocation is available in the browser
 */
export function isGeolocationAvailable(): boolean {
  return 'geolocation' in navigator;
}
