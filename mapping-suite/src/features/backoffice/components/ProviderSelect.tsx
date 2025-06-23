'use client';

import { useEffect } from 'react';
import useMapStore from '@/store/map';

export default function ProviderSelect() {
  const { provider, setProvider } = useMapStore();

  // Load persisted provider on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProvider = localStorage.getItem('map-provider') as 'google' | 'mapbox' | null;
      if (savedProvider && savedProvider !== provider) {
        setProvider(savedProvider);
      }
    }
  }, [provider, setProvider]);
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value as 'google' | 'mapbox';
    setProvider(newProvider);
  };
  return (
    <div className="flex flex-col space-y-2">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="provider-select" className="text-sm font-medium text-gray-700">
        Map Provider
      </label>
      <select
        id="provider-select"
        value={provider}
        onChange={handleProviderChange}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        data-testid="provider-select"
        aria-label="Select map provider"
      >
        <option value="google">Google Maps</option>
        <option value="mapbox" disabled>
          Mapbox (Coming Soon)
        </option>
        <option value="here" disabled>
          Here Maps (Coming Soon)
        </option>
      </select>
    </div>
  );
}
