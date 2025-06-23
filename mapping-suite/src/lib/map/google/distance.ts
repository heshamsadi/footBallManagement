export interface DistanceResult {
  km: number;
  minutes: number;
}

// Simple hash function for cache keys
function hashKey(origin: string, destination: string): string {
  const str = `${origin}-${destination}`;
  let hash = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise, operator-assignment
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export async function calcDistance(origin: string, destination: string): Promise<DistanceResult> {
  const cacheKey = `dist:${hashKey(origin, destination)}`;

  // Check cache first (24h expiry)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;

      if (now - timestamp < dayInMs) {
        return data;
      }
    }
  }

  // Skip real API call in test environment
  if (process.env.NODE_ENV === 'test') {
    const mockResult: DistanceResult = {
      km: Math.round(Math.random() * 100),
      minutes: Math.round(Math.random() * 120),
    };
    return mockResult;
  }

  return new Promise((resolve, reject) => {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0]?.elements[0];

          if (element?.status === google.maps.DistanceMatrixElementStatus.OK) {
            const result: DistanceResult = {
              km: Math.round(element.distance.value / 1000),
              minutes: Math.round(element.duration.value / 60),
            };

            // Cache the result
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data: result,
                  timestamp: Date.now(),
                })
              );
            }

            resolve(result);
          } else {
            reject(new Error('No route found'));
          }
        } else {
          reject(new Error('Distance calculation failed'));
        }
      }
    );
  });
}
